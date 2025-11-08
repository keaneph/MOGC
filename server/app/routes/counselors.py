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
