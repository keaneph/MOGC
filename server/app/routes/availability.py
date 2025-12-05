"""Counselor availability routes"""
from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client
from datetime import datetime

availability_bp = Blueprint("availability", __name__, url_prefix="/api/availability")


@availability_bp.route("", methods=["GET"])
@require_auth
def get_availability(user_id: str):
    """Get counselor's availability (weekly schedule + date overrides)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Get schedule name from query params, default to 'Working hours'
        schedule_name = request.args.get("schedule_name", "Working hours")
        
        response = (
            supabase.table("counselor_availability")
            .select("*")
            .eq("counselor_id", user_id)
            .eq("schedule_name", schedule_name)
            .execute()
        )
        
        # Separate weekly and overrides
        weekly = []
        overrides = []
        
        for row in response.data or []:
            if row["type"] == "weekly":
                weekly.append({
                    "id": row["id"],
                    "dayOfWeek": row["day_of_week"],
                    "startTime": row["start_time"],
                    "endTime": row["end_time"],
                })
            else:
                overrides.append({
                    "id": row["id"],
                    "date": row["specific_date"],
                    "startTime": row["start_time"],
                    "endTime": row["end_time"],
                })
        
        return jsonify({
            "scheduleName": schedule_name,
            "weekly": weekly,
            "overrides": overrides
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@availability_bp.route("", methods=["PUT"])
@require_auth
def save_availability(user_id: str):
    """Save counselor's complete availability (replaces existing)"""
    try:
        data = request.get_json()
        schedule_name = data.get("scheduleName", "Working hours")
        weekly_schedule = data.get("weekly", [])
        date_overrides = data.get("overrides", [])
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Delete existing availability for this schedule
        supabase.table("counselor_availability").delete().eq(
            "counselor_id", user_id
        ).eq("schedule_name", schedule_name).execute()
        
        # Prepare rows to insert
        rows_to_insert = []
        
        # Add weekly schedule rows
        for item in weekly_schedule:
            rows_to_insert.append({
                "counselor_id": user_id,
                "schedule_name": schedule_name,
                "type": "weekly",
                "day_of_week": item["dayOfWeek"],
                "specific_date": None,
                "start_time": item.get("startTime"),
                "end_time": item.get("endTime"),
            })
        
        # Add date override rows
        for item in date_overrides:
            rows_to_insert.append({
                "counselor_id": user_id,
                "schedule_name": schedule_name,
                "type": "override",
                "day_of_week": None,
                "specific_date": item["date"],
                "start_time": item.get("startTime"),
                "end_time": item.get("endTime"),
            })
        
        # Insert all rows
        if rows_to_insert:
            response = supabase.table("counselor_availability").insert(rows_to_insert).execute()
            
            if not response.data:
                return jsonify({"error": "Failed to save availability"}), 500
        
        return jsonify({
            "message": "Availability saved successfully",
            "count": len(rows_to_insert)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@availability_bp.route("/weekly", methods=["POST"])
@require_auth
def add_weekly_slot(user_id: str):
    """Add a single weekly time slot"""
    try:
        data = request.get_json()
        schedule_name = data.get("scheduleName", "Working hours")
        day_of_week = data.get("dayOfWeek")
        start_time = data.get("startTime")
        end_time = data.get("endTime")
        
        if day_of_week is None or day_of_week < 0 or day_of_week > 6:
            return jsonify({"error": "Invalid day of week"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        response = supabase.table("counselor_availability").insert({
            "counselor_id": user_id,
            "schedule_name": schedule_name,
            "type": "weekly",
            "day_of_week": day_of_week,
            "specific_date": None,
            "start_time": start_time,
            "end_time": end_time,
        }).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to add slot"}), 500
        
        return jsonify({
            "message": "Slot added",
            "slot": response.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@availability_bp.route("/override", methods=["POST"])
@require_auth
def add_date_override(user_id: str):
    """Add a date override"""
    try:
        data = request.get_json()
        schedule_name = data.get("scheduleName", "Working hours")
        specific_date = data.get("date")
        start_time = data.get("startTime")  # None = unavailable
        end_time = data.get("endTime")
        
        if not specific_date:
            return jsonify({"error": "Date is required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Remove existing override for this date
        supabase.table("counselor_availability").delete().eq(
            "counselor_id", user_id
        ).eq("schedule_name", schedule_name).eq(
            "specific_date", specific_date
        ).execute()
        
        response = supabase.table("counselor_availability").insert({
            "counselor_id": user_id,
            "schedule_name": schedule_name,
            "type": "override",
            "day_of_week": None,
            "specific_date": specific_date,
            "start_time": start_time,
            "end_time": end_time,
        }).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to add override"}), 500
        
        return jsonify({
            "message": "Override added",
            "override": response.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@availability_bp.route("/<string:slot_id>", methods=["DELETE"])
@require_auth
def delete_slot(user_id: str, slot_id: str):
    """Delete a specific availability slot"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = supabase.table("counselor_availability").delete().eq(
            "id", slot_id
        ).eq("counselor_id", user_id).execute()
        
        return jsonify({"message": "Slot deleted"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@availability_bp.route("/public/<string:counselor_id>", methods=["GET"])
def get_public_availability(counselor_id: str):
    """Get counselor's availability for student booking (public endpoint)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        schedule_name = request.args.get("schedule_name", "Working hours")
        
        response = (
            supabase.table("counselor_availability")
            .select("type, day_of_week, specific_date, start_time, end_time")
            .eq("counselor_id", counselor_id)
            .eq("schedule_name", schedule_name)
            .execute()
        )
        
        weekly = []
        overrides = []
        
        for row in response.data or []:
            if row["type"] == "weekly":
                weekly.append({
                    "dayOfWeek": row["day_of_week"],
                    "startTime": row["start_time"],
                    "endTime": row["end_time"],
                })
            else:
                overrides.append({
                    "date": row["specific_date"],
                    "startTime": row["start_time"],
                    "endTime": row["end_time"],
                })
        
        return jsonify({
            "weekly": weekly,
            "overrides": overrides
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
