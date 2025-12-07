"""
Appointments API routes for booking management
"""

from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client
from datetime import datetime, date, time, timedelta

appointments_bp = Blueprint("appointments", __name__, url_prefix="/api/appointments")


def time_to_minutes(t: time) -> int:
    """Convert time to minutes from midnight"""
    return t.hour * 60 + t.minute


def minutes_to_time(minutes: int) -> time:
    """Convert minutes from midnight to time"""
    return time(hour=minutes // 60, minute=minutes % 60)


def parse_time_string(time_str: str) -> time:
    """Parse time string (HH:MM or HH:MM:SS) to time object"""
    if len(time_str) == 5:
        return datetime.strptime(time_str, "%H:%M").time()
    return datetime.strptime(time_str, "%H:%M:%S").time()


def format_time_12hr(t: time) -> str:
    """Format time as 12-hour string"""
    return t.strftime("%I:%M %p").lstrip("0")


@appointments_bp.route("", methods=["GET"])
@require_auth
def get_appointments(user_id: str):
    """Get appointments for the current user (student or counselor)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Get user role from query params (default to checking both)
        role = request.args.get("role", "both")
        status_filter = request.args.get("status")  # Optional: filter by status
        date_from = request.args.get("from")  # Optional: start date
        date_to = request.args.get("to")  # Optional: end date
        
        # Build query
        query = supabase.table("appointments").select(
            "*, event_types(id, name, duration, color, category)"
        )
        
        # Filter by role
        if role == "student":
            query = query.eq("student_id", user_id)
        elif role == "counselor":
            query = query.eq("counselor_id", user_id)
        else:
            # Get appointments where user is either student or counselor
            query = query.or_(f"student_id.eq.{user_id},counselor_id.eq.{user_id}")
        
        # Apply optional filters
        if status_filter:
            query = query.eq("status", status_filter)
        if date_from:
            query = query.gte("scheduled_date", date_from)
        if date_to:
            query = query.lte("scheduled_date", date_to)
        
        # Order by date and time
        query = query.order("scheduled_date", desc=False).order("start_time", desc=False)
        
        response = query.execute()
        
        appointments = []
        for apt in response.data or []:
            event_type = apt.get("event_types", {})
            
            # Get student/counselor info
            student_info = None
            counselor_info = None
            
            if apt["student_id"] != user_id:
                # Fetch student info
                student_resp = supabase.table("students").select(
                    "given_name, family_name, id_number"
                ).eq("auth_user_id", apt["student_id"]).execute()
                if student_resp.data:
                    s = student_resp.data[0]
                    student_info = {
                        "name": f"{s['given_name']} {s['family_name']}",
                        "idNumber": s["id_number"]
                    }
            
            if apt["counselor_id"] != user_id:
                # Fetch counselor info from profiles table
                counselor_resp = supabase.table("profiles").select(
                    "first_name"
                ).eq("id", apt["counselor_id"]).eq("role", "counselor").execute()
                if counselor_resp.data:
                    c = counselor_resp.data[0]
                    counselor_info = {
                        "name": c.get('first_name', 'Counselor')
                    }
            
            appointments.append({
                "id": apt["id"],
                "studentId": apt["student_id"],
                "counselorId": apt["counselor_id"],
                "eventTypeId": apt["event_type_id"],
                "eventType": {
                    "id": event_type.get("id"),
                    "name": event_type.get("name"),
                    "duration": event_type.get("duration"),
                    "color": event_type.get("color"),
                    "category": event_type.get("category"),
                } if event_type else None,
                "scheduledDate": apt["scheduled_date"],
                "startTime": apt["start_time"],
                "endTime": apt["end_time"],
                "status": apt["status"],
                "studentNotes": apt.get("student_notes"),
                "counselorNotes": apt.get("counselor_notes"),
                "locationType": apt["location_type"],
                "locationDetails": apt.get("location_details"),
                "studentInfo": student_info,
                "counselorInfo": counselor_info,
                "createdAt": apt["created_at"],
                "confirmedAt": apt.get("confirmed_at"),
                "cancelledAt": apt.get("cancelled_at"),
                "completedAt": apt.get("completed_at"),
            })
        
        return jsonify({"appointments": appointments}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@appointments_bp.route("", methods=["POST"])
@require_auth
def create_appointment(user_id: str):
    """Create a new appointment (student booking)"""
    try:
        data = request.get_json()
        
        event_type_id = data.get("eventTypeId")
        counselor_id = data.get("counselorId")
        scheduled_date = data.get("scheduledDate")  # YYYY-MM-DD
        start_time = data.get("startTime")  # HH:MM
        student_notes = data.get("studentNotes")
        
        if not all([event_type_id, counselor_id, scheduled_date, start_time]):
            return jsonify({"error": "Missing required fields"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get event type details
        event_type_resp = supabase.table("event_types").select(
            "duration, location_type, location_details, requires_approval, is_active"
        ).eq("id", event_type_id).execute()
        
        if not event_type_resp.data:
            return jsonify({"error": "Event type not found"}), 404
        
        event_type = event_type_resp.data[0]
        
        if not event_type["is_active"]:
            return jsonify({"error": "This event type is not available for booking"}), 400
        
        # Calculate end time
        start = parse_time_string(start_time)
        duration = event_type["duration"]
        end_minutes = time_to_minutes(start) + duration
        end = minutes_to_time(end_minutes)
        
        # Create appointment
        insert_data = {
            "student_id": user_id,
            "counselor_id": counselor_id,
            "event_type_id": event_type_id,
            "scheduled_date": scheduled_date,
            "start_time": start_time,
            "end_time": end.strftime("%H:%M"),
            "status": "pending",  # Will be auto-confirmed if event type doesn't require approval
            "student_notes": student_notes,
            "location_type": event_type["location_type"],
            "location_details": event_type.get("location_details"),
        }
        
        response = supabase.table("appointments").insert(insert_data).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create appointment"}), 500
        
        apt = response.data[0]
        
        return jsonify({
            "message": "Appointment booked successfully",
            "appointment": {
                "id": apt["id"],
                "scheduledDate": apt["scheduled_date"],
                "startTime": apt["start_time"],
                "endTime": apt["end_time"],
                "status": apt["status"],
            }
        }), 201
        
    except Exception as e:
        error_msg = str(e)
        if "overlaps" in error_msg.lower():
            return jsonify({"error": "This time slot is no longer available"}), 409
        return jsonify({"error": error_msg}), 500


@appointments_bp.route("/<string:appointment_id>", methods=["GET"])
@require_auth
def get_appointment(user_id: str, appointment_id: str):
    """Get a specific appointment"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = supabase.table("appointments").select(
            "*, event_types(id, name, duration, color, category, description)"
        ).eq("id", appointment_id).execute()
        
        if not response.data:
            return jsonify({"error": "Appointment not found"}), 404
        
        apt = response.data[0]
        
        # Verify user has access
        if apt["student_id"] != user_id and apt["counselor_id"] != user_id:
            return jsonify({"error": "Not authorized to view this appointment"}), 403
        
        event_type = apt.get("event_types", {})
        
        return jsonify({
            "appointment": {
                "id": apt["id"],
                "studentId": apt["student_id"],
                "counselorId": apt["counselor_id"],
                "eventTypeId": apt["event_type_id"],
                "eventType": {
                    "id": event_type.get("id"),
                    "name": event_type.get("name"),
                    "duration": event_type.get("duration"),
                    "color": event_type.get("color"),
                    "category": event_type.get("category"),
                    "description": event_type.get("description"),
                } if event_type else None,
                "scheduledDate": apt["scheduled_date"],
                "startTime": apt["start_time"],
                "endTime": apt["end_time"],
                "status": apt["status"],
                "studentNotes": apt.get("student_notes"),
                "counselorNotes": apt.get("counselor_notes"),
                "locationType": apt["location_type"],
                "locationDetails": apt.get("location_details"),
                "cancellationReason": apt.get("cancellation_reason"),
                "createdAt": apt["created_at"],
                "confirmedAt": apt.get("confirmed_at"),
                "cancelledAt": apt.get("cancelled_at"),
                "completedAt": apt.get("completed_at"),
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@appointments_bp.route("/<string:appointment_id>/status", methods=["PUT"])
@require_auth
def update_appointment_status(user_id: str, appointment_id: str):
    """Update appointment status (confirm, cancel, complete, no-show)"""
    try:
        data = request.get_json()
        new_status = data.get("status")
        reason = data.get("reason")  # For cancellation
        counselor_notes = data.get("counselorNotes")
        
        valid_statuses = ["confirmed", "cancelled", "completed", "no_show"]
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get current appointment
        current = supabase.table("appointments").select(
            "student_id, counselor_id, status"
        ).eq("id", appointment_id).execute()
        
        if not current.data:
            return jsonify({"error": "Appointment not found"}), 404
        
        apt = current.data[0]
        
        # Check authorization
        is_student = apt["student_id"] == user_id
        is_counselor = apt["counselor_id"] == user_id
        
        if not is_student and not is_counselor:
            return jsonify({"error": "Not authorized"}), 403
        
        # Status transition rules
        current_status = apt["status"]
        
        # Students can only cancel their pending/confirmed appointments
        if is_student and not is_counselor:
            if new_status != "cancelled":
                return jsonify({"error": "Students can only cancel appointments"}), 403
            if current_status not in ["pending", "confirmed"]:
                return jsonify({"error": "Cannot cancel this appointment"}), 400
        
        # Build update data
        update_data = {"status": new_status}
        
        if new_status == "confirmed":
            update_data["confirmed_at"] = datetime.now().isoformat()
        elif new_status == "cancelled":
            update_data["cancelled_at"] = datetime.now().isoformat()
            update_data["cancelled_by"] = user_id
            if reason:
                update_data["cancellation_reason"] = reason
        elif new_status == "completed":
            update_data["completed_at"] = datetime.now().isoformat()
        
        if counselor_notes and is_counselor:
            update_data["counselor_notes"] = counselor_notes
        
        response = supabase.table("appointments").update(update_data).eq(
            "id", appointment_id
        ).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to update appointment"}), 500
        
        return jsonify({
            "message": f"Appointment {new_status}",
            "status": new_status
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@appointments_bp.route("/available-slots", methods=["GET"])
@require_auth
def get_available_slots(user_id: str):
    """Get available time slots for a counselor on a specific date"""
    try:
        counselor_id = request.args.get("counselorId")
        event_type_id = request.args.get("eventTypeId")
        date_str = request.args.get("date")  # YYYY-MM-DD
        
        if not all([counselor_id, event_type_id, date_str]):
            return jsonify({"error": "Missing required parameters: counselorId, eventTypeId, date"}), 400
        
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        day_of_week = target_date.weekday()  # 0=Monday, 6=Sunday
        # Convert to our format (0=Sunday, 6=Saturday)
        day_of_week = (day_of_week + 1) % 7
        
        supabase = get_supabase_client(use_service_role=True)
        
        # Get event type details
        event_type_resp = supabase.table("event_types").select(
            "duration, buffer_before, buffer_after, schedule_id, max_bookings_per_day"
        ).eq("id", event_type_id).execute()
        
        if not event_type_resp.data:
            return jsonify({"error": "Event type not found"}), 404
        
        event_type = event_type_resp.data[0]
        duration = event_type["duration"]
        buffer_before = event_type.get("buffer_before", 0)
        buffer_after = event_type.get("buffer_after", 0)
        max_per_day = event_type.get("max_bookings_per_day")
        
        # Get schedule for this event type (or default)
        schedule_id = event_type.get("schedule_id")
        
        if schedule_id:
            schedule_resp = supabase.table("counselor_schedules").select(
                "name, booking_buffer"
            ).eq("id", schedule_id).execute()
        else:
            # Get default schedule
            schedule_resp = supabase.table("counselor_schedules").select(
                "name, booking_buffer"
            ).eq("counselor_id", counselor_id).eq("is_default", True).execute()
        
        if not schedule_resp.data:
            return jsonify({"availableSlots": [], "message": "No schedule configured"}), 200
        
        schedule = schedule_resp.data[0]
        booking_buffer_hours = schedule.get("booking_buffer", 24)
        
        # Check booking buffer (minimum advance notice)
        now = datetime.now()
        min_booking_time = now + timedelta(hours=booking_buffer_hours)
        
        if target_date < min_booking_time.date():
            return jsonify({
                "availableSlots": [],
                "message": f"Appointments must be booked at least {booking_buffer_hours} hours in advance"
            }), 200
        
        # Get weekly availability for this day
        availability_resp = supabase.table("counselor_availability").select(
            "start_time, end_time"
        ).eq("counselor_id", counselor_id).eq(
            "schedule_name", schedule["name"]
        ).eq("type", "weekly").eq("day_of_week", day_of_week).execute()
        
        # Check for date override
        override_resp = supabase.table("counselor_availability").select(
            "start_time, end_time"
        ).eq("counselor_id", counselor_id).eq(
            "schedule_name", schedule["name"]
        ).eq("type", "override").eq("specific_date", date_str).execute()
        
        # Determine availability windows
        availability_windows = []
        
        if override_resp.data:
            # Use override instead of weekly
            for row in override_resp.data:
                if row["start_time"] and row["end_time"]:
                    availability_windows.append({
                        "start": parse_time_string(row["start_time"]),
                        "end": parse_time_string(row["end_time"])
                    })
        elif availability_resp.data:
            # Use weekly schedule
            for row in availability_resp.data:
                if row["start_time"] and row["end_time"]:
                    availability_windows.append({
                        "start": parse_time_string(row["start_time"]),
                        "end": parse_time_string(row["end_time"])
                    })
        
        if not availability_windows:
            return jsonify({
                "availableSlots": [],
                "message": "Counselor is not available on this date"
            }), 200
        
        # Get existing appointments for this date
        existing_resp = supabase.table("appointments").select(
            "start_time, end_time, event_type_id"
        ).eq("counselor_id", counselor_id).eq(
            "scheduled_date", date_str
        ).in_("status", ["pending", "confirmed"]).execute()
        
        booked_slots = []
        event_type_bookings_today = 0
        
        for apt in existing_resp.data or []:
            booked_slots.append({
                "start": parse_time_string(apt["start_time"]),
                "end": parse_time_string(apt["end_time"])
            })
            if apt["event_type_id"] == event_type_id:
                event_type_bookings_today += 1
        
        # Check max bookings per day
        if max_per_day and event_type_bookings_today >= max_per_day:
            return jsonify({
                "availableSlots": [],
                "message": "Maximum bookings reached for this event type today"
            }), 200
        
        # Generate available slots
        slot_duration = duration + buffer_before + buffer_after
        available_slots = []
        
        for window in availability_windows:
            current_time = time_to_minutes(window["start"])
            end_time = time_to_minutes(window["end"])
            
            while current_time + duration <= end_time:
                slot_start = minutes_to_time(current_time)
                slot_end = minutes_to_time(current_time + duration)
                
                # Check if slot overlaps with any booked appointment (including buffers)
                slot_start_with_buffer = current_time - buffer_before
                slot_end_with_buffer = current_time + duration + buffer_after
                
                is_available = True
                for booked in booked_slots:
                    booked_start = time_to_minutes(booked["start"])
                    booked_end = time_to_minutes(booked["end"])
                    
                    # Check for overlap
                    if (slot_start_with_buffer < booked_end and 
                        slot_end_with_buffer > booked_start):
                        is_available = False
                        break
                
                # Check if slot is in the past (for today)
                if target_date == min_booking_time.date():
                    slot_datetime = datetime.combine(target_date, slot_start)
                    if slot_datetime <= min_booking_time:
                        is_available = False
                
                if is_available:
                    available_slots.append({
                        "startTime": slot_start.strftime("%H:%M"),
                        "endTime": slot_end.strftime("%H:%M"),
                        "displayTime": format_time_12hr(slot_start)
                    })
                
                # Move to next slot (30 min intervals)
                current_time += 30
        
        return jsonify({
            "availableSlots": available_slots,
            "date": date_str,
            "duration": duration
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@appointments_bp.route("/counselor/<string:counselor_id>/upcoming", methods=["GET"])
@require_auth
def get_counselor_upcoming(user_id: str, counselor_id: str):
    """Get upcoming appointments for a specific counselor (public for students)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        today = date.today().isoformat()
        
        response = supabase.table("appointments").select(
            "scheduled_date"
        ).eq("counselor_id", counselor_id).gte(
            "scheduled_date", today
        ).in_("status", ["pending", "confirmed"]).execute()
        
        # Count appointments per date
        date_counts = {}
        for apt in response.data or []:
            d = apt["scheduled_date"]
            date_counts[d] = date_counts.get(d, 0) + 1
        
        return jsonify({
            "busyDates": date_counts
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

