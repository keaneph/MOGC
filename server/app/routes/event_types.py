"""
Event Types API routes for counselor appointment type management
"""

from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client

event_types_bp = Blueprint("event_types", __name__, url_prefix="/api/event-types")


@event_types_bp.route("", methods=["GET"])
@require_auth
def get_event_types(user_id: str):
    """Get all event types for the current counselor"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("event_types")
            .select("*, counselor_schedules(id, name)")
            .eq("counselor_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
        
        event_types = []
        for et in response.data:
            schedule = et.get("counselor_schedules")
            event_types.append({
                "id": et["id"],
                "name": et["name"],
                "description": et.get("description"),
                "duration": et["duration"],
                "color": et["color"],
                "category": et.get("category", "counseling"),
                "locationType": et["location_type"],
                "locationDetails": et.get("location_details"),
                "isActive": et["is_active"],
                "requiresApproval": et["requires_approval"],
                "maxBookingsPerDay": et.get("max_bookings_per_day"),
                "bufferBefore": et["buffer_before"],
                "bufferAfter": et["buffer_after"],
                "scheduleId": et.get("schedule_id"),
                "scheduleName": schedule["name"] if schedule else None,
                "createdAt": et["created_at"],
                "updatedAt": et["updated_at"],
            })
        
        return jsonify({"eventTypes": event_types}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("", methods=["POST"])
@require_auth
def create_event_type(user_id: str):
    """Create a new event type"""
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        
        if not name:
            return jsonify({"error": "Event type name is required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Build insert data
        insert_data = {
            "counselor_id": user_id,
            "name": name,
            "description": data.get("description"),
            "duration": data.get("duration", 30),
            "color": data.get("color", "#991b1b"),
            "category": data.get("category", "counseling"),
            "location_type": data.get("locationType", "in_person"),
            "location_details": data.get("locationDetails"),
            "is_active": data.get("isActive", True),
            "requires_approval": data.get("requiresApproval", False),
            "max_bookings_per_day": data.get("maxBookingsPerDay"),
            "buffer_before": data.get("bufferBefore", 0),
            "buffer_after": data.get("bufferAfter", 0),
            "schedule_id": data.get("scheduleId"),
        }
        
        response = supabase.table("event_types").insert(insert_data).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create event type"}), 500
        
        new_event_type = response.data[0]
        
        # Fetch schedule name if schedule_id exists
        schedule_name = None
        if new_event_type.get("schedule_id"):
            schedule_response = (
                supabase.table("counselor_schedules")
                .select("name")
                .eq("id", new_event_type["schedule_id"])
                .execute()
            )
            if schedule_response.data:
                schedule_name = schedule_response.data[0]["name"]
        
        return jsonify({
            "message": "Event type created successfully",
            "eventType": {
                "id": new_event_type["id"],
                "name": new_event_type["name"],
                "description": new_event_type.get("description"),
                "duration": new_event_type["duration"],
                "color": new_event_type["color"],
                "category": new_event_type.get("category", "counseling"),
                "locationType": new_event_type["location_type"],
                "locationDetails": new_event_type.get("location_details"),
                "isActive": new_event_type["is_active"],
                "requiresApproval": new_event_type["requires_approval"],
                "maxBookingsPerDay": new_event_type.get("max_bookings_per_day"),
                "bufferBefore": new_event_type["buffer_before"],
                "bufferAfter": new_event_type["buffer_after"],
                "scheduleId": new_event_type.get("schedule_id"),
                "scheduleName": schedule_name,
                "createdAt": new_event_type["created_at"],
                "updatedAt": new_event_type["updated_at"],
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("/<string:event_type_id>", methods=["PUT"])
@require_auth
def update_event_type(user_id: str, event_type_id: str):
    """Update an event type"""
    try:
        data = request.get_json()
        supabase = get_supabase_client(use_service_role=True)
        
        # Verify ownership
        current = (
            supabase.table("event_types")
            .select("*")
            .eq("id", event_type_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not current.data:
            return jsonify({"error": "Event type not found"}), 404
        
        # Build update data (only include fields that are provided)
        update_data = {}
        
        if "name" in data:
            name = data["name"].strip()
            if not name:
                return jsonify({"error": "Event type name cannot be empty"}), 400
            update_data["name"] = name
        
        if "description" in data:
            update_data["description"] = data["description"]
        
        if "duration" in data:
            update_data["duration"] = data["duration"]
        
        if "color" in data:
            update_data["color"] = data["color"]
        
        if "locationType" in data:
            update_data["location_type"] = data["locationType"]
        
        if "locationDetails" in data:
            update_data["location_details"] = data["locationDetails"]
        
        if "isActive" in data:
            update_data["is_active"] = data["isActive"]
        
        if "requiresApproval" in data:
            update_data["requires_approval"] = data["requiresApproval"]
        
        if "maxBookingsPerDay" in data:
            update_data["max_bookings_per_day"] = data["maxBookingsPerDay"]
        
        if "bufferBefore" in data:
            update_data["buffer_before"] = data["bufferBefore"]
        
        if "bufferAfter" in data:
            update_data["buffer_after"] = data["bufferAfter"]
        
        if "category" in data:
            update_data["category"] = data["category"]
        
        if "scheduleId" in data:
            update_data["schedule_id"] = data["scheduleId"]
        
        if not update_data:
            return jsonify({"error": "No changes provided"}), 400
        
        response = (
            supabase.table("event_types")
            .update(update_data)
            .eq("id", event_type_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not response.data:
            return jsonify({"error": "Failed to update event type"}), 500
        
        updated = response.data[0]
        
        # Fetch schedule name if schedule_id exists
        schedule_name = None
        if updated.get("schedule_id"):
            schedule_response = (
                supabase.table("counselor_schedules")
                .select("name")
                .eq("id", updated["schedule_id"])
                .execute()
            )
            if schedule_response.data:
                schedule_name = schedule_response.data[0]["name"]
        
        return jsonify({
            "message": "Event type updated successfully",
            "eventType": {
                "id": updated["id"],
                "name": updated["name"],
                "description": updated.get("description"),
                "duration": updated["duration"],
                "color": updated["color"],
                "category": updated.get("category", "counseling"),
                "locationType": updated["location_type"],
                "locationDetails": updated.get("location_details"),
                "isActive": updated["is_active"],
                "requiresApproval": updated["requires_approval"],
                "maxBookingsPerDay": updated.get("max_bookings_per_day"),
                "bufferBefore": updated["buffer_before"],
                "bufferAfter": updated["buffer_after"],
                "scheduleId": updated.get("schedule_id"),
                "scheduleName": schedule_name,
                "createdAt": updated["created_at"],
                "updatedAt": updated["updated_at"],
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("/<string:event_type_id>", methods=["DELETE"])
@require_auth
def delete_event_type(user_id: str, event_type_id: str):
    """Delete an event type"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Verify ownership
        current = (
            supabase.table("event_types")
            .select("id")
            .eq("id", event_type_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not current.data:
            return jsonify({"error": "Event type not found"}), 404
        
        # Delete the event type
        supabase.table("event_types").delete().eq(
            "id", event_type_id
        ).eq("counselor_id", user_id).execute()
        
        return jsonify({"message": "Event type deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("/<string:event_type_id>/duplicate", methods=["POST"])
@require_auth
def duplicate_event_type(user_id: str, event_type_id: str):
    """Duplicate an event type"""
    try:
        data = request.get_json()
        new_name = data.get("name", "").strip()
        
        if not new_name:
            return jsonify({"error": "New event type name is required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get source event type
        source = (
            supabase.table("event_types")
            .select("*")
            .eq("id", event_type_id)
            .eq("counselor_id", user_id)
            .execute()
        )
        
        if not source.data:
            return jsonify({"error": "Source event type not found"}), 404
        
        source_et = source.data[0]
        
        # Create duplicate
        insert_data = {
            "counselor_id": user_id,
            "name": new_name,
            "description": source_et.get("description"),
            "duration": source_et["duration"],
            "color": source_et["color"],
            "category": source_et.get("category", "counseling"),
            "location_type": source_et["location_type"],
            "location_details": source_et.get("location_details"),
            "is_active": False,  # Start duplicates as inactive
            "requires_approval": source_et["requires_approval"],
            "max_bookings_per_day": source_et.get("max_bookings_per_day"),
            "buffer_before": source_et["buffer_before"],
            "buffer_after": source_et["buffer_after"],
            "schedule_id": source_et.get("schedule_id"),
        }
        
        response = supabase.table("event_types").insert(insert_data).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to duplicate event type"}), 500
        
        new_event_type = response.data[0]
        
        # Fetch schedule name if schedule_id exists
        schedule_name = None
        if new_event_type.get("schedule_id"):
            schedule_response = (
                supabase.table("counselor_schedules")
                .select("name")
                .eq("id", new_event_type["schedule_id"])
                .execute()
            )
            if schedule_response.data:
                schedule_name = schedule_response.data[0]["name"]
        
        return jsonify({
            "message": "Event type duplicated successfully",
            "eventType": {
                "id": new_event_type["id"],
                "name": new_event_type["name"],
                "description": new_event_type.get("description"),
                "duration": new_event_type["duration"],
                "color": new_event_type["color"],
                "category": new_event_type.get("category", "counseling"),
                "locationType": new_event_type["location_type"],
                "locationDetails": new_event_type.get("location_details"),
                "isActive": new_event_type["is_active"],
                "requiresApproval": new_event_type["requires_approval"],
                "maxBookingsPerDay": new_event_type.get("max_bookings_per_day"),
                "bufferBefore": new_event_type["buffer_before"],
                "bufferAfter": new_event_type["buffer_after"],
                "scheduleId": new_event_type.get("schedule_id"),
                "scheduleName": schedule_name,
                "createdAt": new_event_type["created_at"],
                "updatedAt": new_event_type["updated_at"],
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("/by-schedule/<string:schedule_id>", methods=["GET"])
@require_auth
def get_event_types_by_schedule(user_id: str, schedule_id: str):
    """Get event types linked to a specific schedule"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Get event types that use this schedule
        response = (
            supabase.table("event_types")
            .select("id, name, color, is_active")
            .eq("counselor_id", user_id)
            .eq("schedule_id", schedule_id)
            .eq("is_active", True)
            .order("name")
            .execute()
        )
        
        event_types = [
            {
                "id": et["id"],
                "name": et["name"],
                "color": et["color"],
                "isActive": et["is_active"],
            }
            for et in response.data
        ]
        
        return jsonify({"eventTypes": event_types}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@event_types_bp.route("/public/<string:counselor_id>", methods=["GET"])
def get_public_event_types(counselor_id: str):
    """Get active event types for a counselor (public endpoint for students)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Optional category filter
        category = request.args.get("category")
        
        query = (
            supabase.table("event_types")
            .select("id, name, description, duration, color, category, location_type, location_details")
            .eq("counselor_id", counselor_id)
            .eq("is_active", True)
        )
        
        if category:
            query = query.eq("category", category)
        
        response = query.order("name").execute()
        
        event_types = []
        for et in response.data:
            event_types.append({
                "id": et["id"],
                "name": et["name"],
                "description": et.get("description"),
                "duration": et["duration"],
                "color": et["color"],
                "category": et.get("category", "counseling"),
                "locationType": et["location_type"],
                "locationDetails": et.get("location_details"),
            })
        
        return jsonify({"eventTypes": event_types}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
