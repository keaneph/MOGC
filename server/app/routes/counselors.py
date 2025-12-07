from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client

counselors_bp = Blueprint("counselors", __name__, url_prefix="/api/counselors")


@counselors_bp.route("/assigned", methods=["GET"])
@require_auth
def get_assigned_counselor(user_id: str):
    """Get the counselor assigned to the current student based on their course"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        # Get student's course (don't use .single() to avoid error on no rows)
        student_response = (
            supabase.table("students")
            .select("course")
            .eq("auth_user_id", user_id)
            .limit(1)
            .execute()
        )
        
        if not student_response.data or len(student_response.data) == 0:
            return jsonify({"error": "Student profile not found"}), 404
        
        student_course = student_response.data[0].get("course")
        if not student_course:
            return jsonify({"error": "Your profile doesn't have a course set. Please complete your profile first."}), 404
        
        # Find counselor who handles this course
        counselor_response = (
            supabase.table("counselor_course_filters")
            .select("auth_user_id")
            .eq("course", student_course)
            .limit(1)
            .execute()
        )
        
        if not counselor_response.data:
            return jsonify({"error": "No counselor assigned for your course"}), 404
        
        counselor_id = counselor_response.data[0]["auth_user_id"]
        
        # Get counselor details from profiles table (not counselors)
        counselor_details = (
            supabase.table("profiles")
            .select("first_name")
            .eq("id", counselor_id)
            .eq("role", "counselor")
            .limit(1)
            .execute()
        )
        
        counselor_name = None
        if counselor_details.data and len(counselor_details.data) > 0:
            c = counselor_details.data[0]
            counselor_name = c.get('first_name', '')
        
        return jsonify({
            "counselorId": counselor_id,
            "counselorName": counselor_name,
            "studentCourse": student_course
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student-list", methods=["GET"])
@require_auth
def get_student_list(user_id: str):
    """Get student list filtered by counselor's assigned courses"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        # 1. Get counselor course filters
        course_response = (
            supabase.table("counselor_course_filters")
            .select("course")
            .eq("auth_user_id", user_id)
            .execute()
        )

        if not course_response.data:
            return jsonify({"students": []}), 200

        assigned_courses = [row["course"] for row in course_response.data]

        # 2. Get student_list joined with students, filtered by course
        student_response = (
            supabase.table("student_list")
            .select("""
                id,
                student_id,
                year_level,
                assessment,
                initial_interview,
                counseling_status,
                exit_interview,
                students:students!student_list_student_id_fkey(
                    id_number, given_name, family_name, course
                )
            """)
            .in_("students.course", assigned_courses)
            .execute()
        )

        formatted = []
        for row in student_response.data:
            student = row.get("students") or {}
            if not student:
                continue

            formatted.append({
                "idNumber": student.get("id_number"),
                "studentName": f"{student.get('given_name','')} {student.get('family_name','')}",
                "course": student.get("course"),
                "yearLevel": row.get("year_level"),
                "assessment": row.get("assessment"),
                "initialInterview": row.get("initial_interview"),
                "counselingStatus": row.get("counseling_status"),
                "exitInterview": row.get("exit_interview"),
                "studentAuthId": row.get("student_id"),
            })

        return jsonify({"students": formatted}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@counselors_bp.route("/student/<string:student_auth_id>/assessment", methods=["PUT"])
@require_auth
def update_student_assessment(user_id: str, student_auth_id: str):
    """Update assessment status for a student"""
    try:
        data = request.get_json()
        new_assessment = data.get("assessment")

        if new_assessment not in ["pending", "high risk", "low risk"]:
            return jsonify({"error": "Invalid assessment value"}), 400

        supabase = get_supabase_client(use_service_role=True)

        student_lookup = (
            supabase.table("student_list")
            .update({"assessment": new_assessment})
            .eq("student_id", student_auth_id)
            .execute()
        )

        if not student_lookup.data:
            return jsonify({"error": "Failed to update assessment"}), 500

        return jsonify({
            "message": "Assessment updated successfully",
            "updated": student_lookup.data[0]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:student_auth_id>/counseling_status", methods=["PUT"])
@require_auth
def update_student_counselingstatus(user_id: str, student_auth_id: str):
    data = request.get_json()
    new_status = data.get("counseling_status")

    if new_status not in ["no record", "ongoing", "closed"]:
        return jsonify({"error": "Invalid counseling status"}), 400

    supabase = get_supabase_client(use_service_role=True)

    student_lookup = (
        supabase.table("student_list")
        .update({"counseling_status": new_status})
        .eq("student_id", student_auth_id)
        .execute()
    )

    if not student_lookup.data:
        return jsonify({"error": "Failed to update status"}), 500

    return jsonify({
        "message": "Counseling status updated successfully",
        "updated": student_lookup.data[0]
    }), 200

    
@counselors_bp.route("/student/<string:id_number>/notes", methods=["GET"])
@require_auth
def get_student_notes(user_id: str, id_number: str):
    """Fetch notes for a student"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        student_lookup = (
            supabase.table("students")
            .select("id")
            .eq("id_number", id_number)
            .single()
            .execute()
        )

        if not student_lookup.data:
            return jsonify({"error": "Student not found"}), 404

        student_id = student_lookup.data["id"]

        response = (
            supabase.table("student_notes")
            .select("id, student_id, note_type, content, created_at, note_title")
            .eq("student_id", student_id)
            .order("created_at", desc=True)
            .execute()
        )

        return jsonify({"notes": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:id_number>/notes", methods=["POST"])
@require_auth
def add_student_note(user_id: str, id_number: str):
    """Add a new note for a student"""
    try:
        data = request.get_json()
        note_title = data.get("note_title")
        note_type = data.get("note_type")
        content = data.get("content")

        if not note_title or not note_type or not content:
            return jsonify({"error": "Missing required fields"}), 400

        if note_type not in ["regular", "progress", "closure"]:
            return jsonify({"error": "Invalid note type"}), 400

        supabase = get_supabase_client(use_service_role=True)

        student_lookup = (
            supabase.table("students")
            .select("id")
            .eq("id_number", id_number)
            .single()
            .execute()
        )

        if not student_lookup.data:
            return jsonify({"error": "Student not found"}), 404

        student_id = student_lookup.data["id"]

        response = (
            supabase.table("student_notes")
            .insert(
                {
                    "student_id": student_id,
                    "note_title": note_title,
                    "note_type": note_type,
                    "content": content,
                }
            )
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Failed to insert note"}), 500

        return jsonify({"note": response.data[0]}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@counselors_bp.route("/student/<string:id_number>/notes/<string:note_id>", methods=["PUT"])
@require_auth
def update_student_note(user_id: str, id_number: str, note_id: str):
    """Update an existing note"""
    try:
        data = request.get_json()
        note_title = data.get("note_title")
        note_type = data.get("note_type")
        content = data.get("content")

        supabase = get_supabase_client(use_service_role=True)

        student_lookup = (
            supabase.table("students")
            .select("id")
            .eq("id_number", id_number)
            .single()
            .execute()
        )
        if not student_lookup.data:
            return jsonify({"error": "Student not found"}), 404

        student_id = student_lookup.data["id"]

        response = (
            supabase.table("student_notes")
            .update(
                {
                    "note_title": note_title,
                    "note_type": note_type,
                    "content": content,
                }
            )
            .eq("id", note_id)
            .eq("student_id", student_id)
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Failed to update note"}), 500

        return jsonify({"note": response.data[0]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:id_number>/notes/<string:note_id>", methods=["DELETE"])
@require_auth
def delete_student_note(user_id: str, id_number: str, note_id: str):
    """Delete a note for a student"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        student_lookup = (
            supabase.table("students")
            .select("id")
            .eq("id_number", id_number)
            .single()
            .execute()
        )
        if not student_lookup.data:
            return jsonify({"error": "Student not found"}), 404

        student_id = student_lookup.data["id"]

        response = (
            supabase.table("student_notes")
            .delete()
            .eq("id", note_id)
            .eq("student_id", student_id)
            .execute()
        )

        if not response.data:   
            return jsonify({"error": "Failed to delete note"}), 500

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:student_auth_id>/profile", methods=["GET"])
@require_auth
def get_student_profile(user_id: str, student_auth_id: str):
    """Get student profile data by auth_user_id"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        response = (
            supabase.table("students")
            .select("*")
            .eq("auth_user_id", student_auth_id)
            .maybe_single()
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Student not found"}), 404

        return jsonify({"profile": response.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:student_auth_id>/email", methods=["GET"])
@require_auth
def get_student_email(user_id: str, student_auth_id: str):
    """Get student email by auth_user_id"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        response = (
            supabase.table("students_with_email")
            .select("email")
            .eq("auth_user_id", student_auth_id)
            .maybe_single()
            .execute()
        )

        if not response.data:
            return jsonify({"error": "Student not found"}), 404

        return jsonify({"email": response.data["email"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@counselors_bp.route("/student/<string:student_auth_id>/exists", methods=["GET"])
@require_auth
def profile_exists_by_authid(user_id: str, student_auth_id:str):
    """Check if student profile exists through student_auth_id"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        response = (
            supabase.table("students")
            .select("id")
            .eq("auth_user_id", student_auth_id)
            .execute()
        )

        exists = len(response.data) > 0 and response.data[0] is not None

        return jsonify({"exists": exists}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@counselors_bp.route("/student/<string:student_auth_id>/completion-status", methods=["GET"])
@require_auth
def get_student_profile_completion_status_by_authid(user_id: str, student_auth_id:str):
    """Check if student profile is in progress or completed"""
    try:
        supabase =  get_supabase_client(use_service_role=True)
        result = (
            supabase.table("students")
            .select(
                "is_personal_data_complete, is_family_data_complete, is_academic_data_complete, "
                "is_distance_learning_data_complete, is_psychosocial_data_complete, is_needs_assessment_data_complete"
            )
            .eq("auth_user_id", student_auth_id)
            .single()
            .execute()
        )

        if not result.data:
            return jsonify({"error": "Student profile not found"}), 404
        
        data = result.data
        complete = all([
            data.get("is_personal_data_complete"),
            data.get("is_family_data_complete"),
            data.get("is_academic_data_complete"),
            data.get("is_distance_learning_data_complete"),
            data.get("is_psychosocial_data_complete"),
            data.get("is_needs_assessment_data_complete"),
        ])

        return jsonify({"complete": complete}), 200

    except Exception as e:
        print("Unexpected error in /profile/completion-status:", e)
        return jsonify({"error": str(e)}), 500


