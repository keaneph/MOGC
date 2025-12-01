from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client

counselors_bp = Blueprint("counselors", __name__, url_prefix="/api/counselors")

@counselors_bp.route("/student-list", methods=["GET"])
@require_auth
def get_student_list(user_id: str):
    """Get student list filtered by counselor's assigned courses"""
    try:
        supabase = get_supabase_client(use_service_role=True)

        course_response = (
            supabase.table("counselor_course_filters")
            .select("course")
            .eq("auth_user_id", user_id)
            .execute()
        )

        if not course_response.data:
            return jsonify({"students": []}), 200

        assigned_courses = [row["course"] for row in course_response.data]

        student_response = (
            supabase.table("student_list")
            .select(
                "year_level, assessment, initial_interview, counseling_status, "
                "students(id_number, given_name, family_name, course)"
            )
            .in_("students.course", assigned_courses)
            .execute()
        )

        if not student_response.data:
            return jsonify({"students": []}), 200

        formatted = []

        for row in student_response.data:
            student = row.get("students", {})
            if not student:
                continue
            formatted.append({
                "idNumber": student.get("id_number"),
                "studentName": f"{student.get('given_name')} {student.get('family_name')}",
                "course": student.get("course"),
                "yearLevel": row.get("year_level"),
                "assessment": row.get("assessment"),
                "initialInterview": row.get("initial_interview"),
                "counselingStatus": row.get("counseling_status")
            })

        return jsonify({"students": formatted}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:id_number>/assessment", methods=["PUT"])
@require_auth
def update_student_assessment(user_id: str, id_number: str):
    """Update assessment status for a student"""
    try:
        data = request.get_json()
        new_assessment = data.get("assessment")

        if new_assessment not in ["pending", "high risk", "low risk"]:
            return jsonify({"error": "Invalid assessment value"}), 400

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
            supabase.table("student_list")
            .update({"assessment": new_assessment})
            .eq("student_id", student_id)
            .execute()
        )

        if response.data is None or len(response.data) == 0:
            return jsonify({"error": "Failed to update assessment"}), 500

        return jsonify({
            "message": "Assessment updated successfully",
            "updated": response.data[0]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@counselors_bp.route("/student/<string:id_number>/initial_interview", methods=["PUT"])
@require_auth
def update_student_interview(user_id: str, id_number: str):
    """Update assessment status for a student"""
    try:
        data = request.get_json()
        new_interview = data.get("initial_interview")

        if new_interview not in ["pending", "scheduled", "rescheduled", "done"]:
            return jsonify({"error": "Invalid interview value"}), 400

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
            supabase.table("student_list")
            .update({"initial_interview": new_interview})
            .eq("student_id", student_id)
            .execute()
        )

        if response.data is None or len(response.data) == 0:
            return jsonify({"error": "Failed to update interview"}), 500

        return jsonify({
            "message": "Initial interview updated successfully",
            "updated": response.data[0]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@counselors_bp.route("/student/<string:id_number>/counseling_status", methods=["PUT"])
@require_auth
def update_student_counselingstatus(user_id: str, id_number: str):
    """Update assessment status for a student"""
    try:
        data = request.get_json()
        new_status = data.get("counseling_status")

        if new_status not in ["no record", "ongoing", "closed"]:
            return jsonify({"error": "Invalid counseling status"}), 400

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
            supabase.table("student_list")
            .update({"counseling_status": new_status})
            .eq("student_id", student_id)
            .execute()
        )

        if response.data is None or len(response.data) == 0:
            return jsonify({"error": "Failed to update status"}), 500

        return jsonify({
            "message": "Counseling status updated successfully",
            "updated": response.data[0]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
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




