"""
Student Activity History API routes
Aggregates appointments, assessments, and other activities for student dashboard
"""

from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client
from datetime import date
from typing import Dict, Any

activity_bp = Blueprint("activity", __name__, url_prefix="/api/activity")


def get_activity_stats(student_id: str, date_from: str = None, date_to: str = None) -> Dict[str, Any]:
    """Calculate activity statistics for a student"""
    supabase = get_supabase_client(use_service_role=True)
    
    # Build base query
    query = supabase.table("appointments").select("*").eq("student_id", student_id)
    
    if date_from:
        query = query.gte("scheduled_date", date_from)
    if date_to:
        query = query.lte("scheduled_date", date_to)
    
    appointments = query.execute()
    apt_data = appointments.data or []
    
    # Count by status
    counseling_sessions = len([a for a in apt_data if a["status"] == "completed"])
    pending_appointments = len([a for a in apt_data if a["status"] == "pending"])
    upcoming_appointments = len([
        a for a in apt_data 
        if a["status"] == "confirmed" and a["scheduled_date"] >= date.today().isoformat()
    ])
    cancelled_count = len([a for a in apt_data if a["status"] == "cancelled"])
    no_show_count = len([a for a in apt_data if a["status"] == "no-show"])
    
    return {
        "counselingSessions": counseling_sessions,
        "pendingAppointments": pending_appointments,
        "upcomingAppointments": upcoming_appointments,
        "cancelledAppointments": cancelled_count,
        "noShowAppointments": no_show_count,
        "totalActivities": len(apt_data)
    }


@activity_bp.route("/stats", methods=["GET"])
@require_auth
def get_stats(user_id: str):
    """Get activity statistics for the current student"""
    try:
        # Get optional date filters
        date_from = request.args.get("from")
        date_to = request.args.get("to")
        
        stats = get_activity_stats(user_id, date_from, date_to)
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
