"""Counselor schedule management routes (CRUD for schedules)"""
from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client

schedules_bp = Blueprint("schedules", __name__, url_prefix="/api/schedules")


@schedules_bp.route("", methods=["GET"])
@require_auth
def get_schedules(user_id: str):
    """Get all schedules for a counselor"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("counselor_schedules")
            .select("*")
            .eq("counselor_id", user_id)
            .order("created_at")
            .execute()
        )
        
        schedules = [
            {
                "id": row["id"],
                "name": row["name"],
                "isDefault": row["is_default"],
                "bookingBuffer": row.get("booking_buffer", 24),
                "createdAt": row["created_at"],
                "updatedAt": row["updated_at"],
            }
            for row in response.data or []
        ]
        
        return jsonify({"schedules": schedules}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedules_bp.route("", methods=["POST"])
@require_auth
def create_schedule(user_id: str):
    """Create a new schedule"""
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        is_default = data.get("isDefault", False)
        booking_buffer = data.get("bookingBuffer", 24)
        duplicate_from = data.get("duplicateFrom")  # Optional: schedule name to copy from
        
        if not name:
            return jsonify({"error": "Schedule name is required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Check if schedule name already exists for this counselor
        existing = (
            supabase.table("counselor_schedules")
            .select("id")
            .eq("counselor_id", user_id)
            .eq("name", name)
            .execute()
        )
        
        if existing.data:
            return jsonify({"error": "A schedule with this name already exists"}), 400
        
        # Create the new schedule
        response = supabase.table("counselor_schedules").insert({
            "counselor_id": user_id,
            "name": name,
            "is_default": is_default,
            "booking_buffer": booking_buffer,
        }).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create schedule"}), 500
        
        new_schedule = response.data[0]
        
        # If duplicating from another schedule, copy its availability
        if duplicate_from:
            # Get availability from source schedule
            source_availability = (
                supabase.table("counselor_availability")
                .select("*")
                .eq("counselor_id", user_id)
                .eq("schedule_name", duplicate_from)
                .execute()
            )
            
            if source_availability.data:
                # Create copies with new schedule name
                rows_to_insert = []
                for row in source_availability.data:
                    rows_to_insert.append({
                        "counselor_id": user_id,
                        "schedule_name": name,
                        "type": row["type"],
                        "day_of_week": row["day_of_week"],
                        "specific_date": row["specific_date"],
                        "start_time": row["start_time"],
                        "end_time": row["end_time"],
                    })
                
                if rows_to_insert:
                    supabase.table("counselor_availability").insert(rows_to_insert).execute()
        else:
            # Initialize with default availability (Mon-Fri 9-5)
            default_availability = []
            for day in range(7):
                if day == 0 or day == 6:  # Sunday and Saturday
                    default_availability.append({
                        "counselor_id": user_id,
                        "schedule_name": name,
                        "type": "weekly",
                        "day_of_week": day,
                        "specific_date": None,
                        "start_time": None,
                        "end_time": None,
                    })
                else:  # Monday to Friday
                    default_availability.append({
                        "counselor_id": user_id,
                        "schedule_name": name,
                        "type": "weekly",
                        "day_of_week": day,
                        "specific_date": None,
                        "start_time": "09:00",
                        "end_time": "17:00",
                    })
            
            supabase.table("counselor_availability").insert(default_availability).execute()
        
        return jsonify({
            "message": "Schedule created successfully",
            "schedule": {
                "id": new_schedule["id"],
                "name": new_schedule["name"],
                "isDefault": new_schedule["is_default"],
                "bookingBuffer": new_schedule.get("booking_buffer", 24),
                "createdAt": new_schedule["created_at"],
                "updatedAt": new_schedule["updated_at"],
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedules_bp.route("/<string:schedule_id>", methods=["PUT"])
@require_auth
def update_schedule(user_id: str, schedule_id: str):
    """Update a schedule (rename, set as default, or update booking buffer)"""
    try:
        data = request.get_json()
        new_name = data.get("name", "").strip()
        is_default = data.get("isDefault")
        booking_buffer = data.get("bookingBuffer")
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get current schedule
        current = (
            supabase.table("counselor_schedules")
            .select("*")
            .eq("id", schedule_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not current.data:
            return jsonify({"error": "Schedule not found"}), 404
        
        old_name = current.data[0]["name"]
        update_data = {}
        
        # Handle name change
        if new_name and new_name != old_name:
            # Check if new name already exists
            existing = (
                supabase.table("counselor_schedules")
                .select("id")
                .eq("counselor_id", user_id)
                .eq("name", new_name)
                .neq("id", schedule_id)
                .execute()
            )
            
            if existing.data:
                return jsonify({"error": "A schedule with this name already exists"}), 400
            
            update_data["name"] = new_name
            
            # Also update schedule_name in counselor_availability
            supabase.table("counselor_availability").update({
                "schedule_name": new_name
            }).eq("counselor_id", user_id).eq("schedule_name", old_name).execute()
        
        # Handle default change
        if is_default is not None:
            update_data["is_default"] = is_default
        
        # Handle booking buffer change
        if booking_buffer is not None:
            update_data["booking_buffer"] = booking_buffer
        
        if not update_data:
            return jsonify({"error": "No changes provided"}), 400
        
        # Update the schedule
        response = (
            supabase.table("counselor_schedules")
            .update(update_data)
            .eq("id", schedule_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not response.data:
            return jsonify({"error": "Failed to update schedule"}), 500
        
        updated = response.data[0]
        
        return jsonify({
            "message": "Schedule updated successfully",
            "schedule": {
                "id": updated["id"],
                "name": updated["name"],
                "isDefault": updated["is_default"],
                "bookingBuffer": updated.get("booking_buffer", 24),
                "createdAt": updated["created_at"],
                "updatedAt": updated["updated_at"],
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedules_bp.route("/<string:schedule_id>", methods=["DELETE"])
@require_auth
def delete_schedule(user_id: str, schedule_id: str):
    """Delete a schedule and its associated availability"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Get current schedule
        current = (
            supabase.table("counselor_schedules")
            .select("*")
            .eq("id", schedule_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not current.data:
            return jsonify({"error": "Schedule not found"}), 404
        
        schedule_name = current.data[0]["name"]
        was_default = current.data[0]["is_default"]
        
        # Check if this is the last schedule
        all_schedules = (
            supabase.table("counselor_schedules")
            .select("id")
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if len(all_schedules.data) <= 1:
            return jsonify({"error": "Cannot delete the last schedule. At least one schedule must exist."}), 400
        
        # Delete associated availability first
        supabase.table("counselor_availability").delete().eq(
            "counselor_id", user_id
        ).eq("schedule_name", schedule_name).execute()
        
        # Delete the schedule
        supabase.table("counselor_schedules").delete().eq(
            "id", schedule_id
        ).eq("counselor_id", user_id).execute()
        
        # If deleted schedule was default, set another one as default
        if was_default:
            remaining = (
                supabase.table("counselor_schedules")
                .select("id")
                .eq("counselor_id", user_id)
                .order("created_at")
                .limit(1)
                .execute()
            )
            
            if remaining.data:
                supabase.table("counselor_schedules").update({
                    "is_default": True
                }).eq("id", remaining.data[0]["id"]).execute()
        
        return jsonify({"message": "Schedule deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@schedules_bp.route("/<string:schedule_id>/duplicate", methods=["POST"])
@require_auth
def duplicate_schedule(user_id: str, schedule_id: str):
    """Duplicate a schedule with a new name"""
    try:
        data = request.get_json()
        new_name = data.get("name", "").strip()
        
        if not new_name:
            return jsonify({"error": "New schedule name is required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get source schedule
        source = (
            supabase.table("counselor_schedules")
            .select("*")
            .eq("id", schedule_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not source.data:
            return jsonify({"error": "Source schedule not found"}), 404
        
        source_name = source.data[0]["name"]
        source_booking_buffer = source.data[0].get("booking_buffer", 24)
        
        # Check if new name already exists
        existing = (
            supabase.table("counselor_schedules")
            .select("id")
            .eq("counselor_id", user_id)
            .eq("name", new_name)
            .execute()
        )
        
        if existing.data:
            return jsonify({"error": "A schedule with this name already exists"}), 400
        
        # Create new schedule
        new_schedule_response = supabase.table("counselor_schedules").insert({
            "counselor_id": user_id,
            "name": new_name,
            "is_default": False,
            "booking_buffer": source_booking_buffer,
        }).execute()
        
        if not new_schedule_response.data:
            return jsonify({"error": "Failed to create duplicate schedule"}), 500
        
        # Copy availability from source
        source_availability = (
            supabase.table("counselor_availability")
            .select("*")
            .eq("counselor_id", user_id)
            .eq("schedule_name", source_name)
            .execute()
        )
        
        if source_availability.data:
            rows_to_insert = []
            for row in source_availability.data:
                rows_to_insert.append({
                    "counselor_id": user_id,
                    "schedule_name": new_name,
                    "type": row["type"],
                    "day_of_week": row["day_of_week"],
                    "specific_date": row["specific_date"],
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                })
            
            if rows_to_insert:
                supabase.table("counselor_availability").insert(rows_to_insert).execute()
        
        new_schedule = new_schedule_response.data[0]
        
        return jsonify({
            "message": "Schedule duplicated successfully",
            "schedule": {
                "id": new_schedule["id"],
                "name": new_schedule["name"],
                "isDefault": new_schedule["is_default"],
                "bookingBuffer": new_schedule.get("booking_buffer", 24),
                "createdAt": new_schedule["created_at"],
                "updatedAt": new_schedule["updated_at"],
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
