"""Student profile API routes"""
from flask import Blueprint, request, jsonify
from app.utils.auth import require_auth
from app.services.supabase_service import get_supabase_client
from app.models.student import (
    transform_personal_data_a,
    transform_personal_data_b,
    transform_personal_data_c,
    transform_family_data_a,
    transform_family_data_b,
    transform_from_personal_data_a,
    transform_from_personal_data_b,
    transform_from_personal_data_c,
    transform_from_family_data_a,
    transform_from_family_data_b,
    check_personal_data_complete,
    check_family_data_complete,
)

students_bp = Blueprint("students", __name__, url_prefix="/api/students")


@students_bp.route("/profile/exists", methods=["GET"])
@require_auth
def profile_exists(user_id: str):
    """Check if student profile exists for current user"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("students")
            .select("id")
            .eq("auth_user_id", user_id)
            .execute()
        )
        
        exists = len(response.data) > 0 and response.data[0] is not None
        
        return jsonify({"exists": exists}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@students_bp.route("/profile/progress", methods=["GET"])
@require_auth
def get_profile_progress(user_id: str):
    """Get student profile progress/completion status"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("students")
            .select(
                "is_personal_data_complete, is_family_data_complete, "
                "id_number, religious_affiliation, gender_identity, "
                "father_name, guardian_name"
            )
            .eq("auth_user_id", user_id)
            .execute()
        )
        
        if not response.data:
            return jsonify({
                "lastSection": None,
                "lastPart": None,
                "completedSections": []
            }), 200
        
        data = response.data[0]
        
        completed_sections = []
        if data.get("is_personal_data_complete"):
            completed_sections.append(0)
        if data.get("is_family_data_complete"):
            completed_sections.append(1)
        
        # determine last section/part based on what's filled
        last_section = None
        last_part = None
        
        # check from most recent to least recent
        if data.get("guardian_name"):
            last_section = 1
            last_part = 1
        elif data.get("father_name"):
            last_section = 1
            last_part = 0
        elif data.get("gender_identity"):
            last_section = 0
            last_part = 2
        elif data.get("religious_affiliation"):
            last_section = 0
            last_part = 1
        elif data.get("id_number"):
            last_section = 0
            last_part = 0
        else:
            last_section = 0
            last_part = 0
        
        return jsonify({
            "lastSection": last_section,
            "lastPart": last_part,
            "completedSections": completed_sections
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@students_bp.route("/section", methods=["GET"])
@require_auth
def get_student_section(user_id: str):
    """Get student section data and convert to form format"""
    try:
        section_index = request.args.get("section", type=int)
        part_index = request.args.get("part", type=int)
        
        if section_index is None or part_index is None:
            return jsonify({"error": "section and part query parameters required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("students")
            .select("*")
            .eq("auth_user_id", user_id)
            .execute()
        )
        
        if not response.data:
            return jsonify({"data": None}), 200
        
        db_record = response.data[0]
        
        # transform based on section and part
        form_data = None
        
        if section_index == 0:  # Personal Data
            if part_index == 0:
                form_data = transform_from_personal_data_a(db_record)
            elif part_index == 1:
                form_data = transform_from_personal_data_b(db_record)
            elif part_index == 2:
                form_data = transform_from_personal_data_c(db_record)
        
        elif section_index == 1:  # Family Data
            if part_index == 0:
                form_data = transform_from_family_data_a(db_record)
            elif part_index == 1:
                form_data = transform_from_family_data_b(db_record)
        
        return jsonify({"data": form_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@students_bp.route("/section", methods=["POST"])
@require_auth
def save_student_section(user_id: str):
    """Save student section data to database"""
    try:
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({"error": "Request body required"}), 400
        
        form_data = request_data.get("formData")
        section_index = request_data.get("sectionIndex")
        part_index = request_data.get("partIndex")
        
        if form_data is None or section_index is None or part_index is None:
            return jsonify({"error": "formData, sectionIndex, and partIndex required"}), 400
        
        supabase = get_supabase_client(use_service_role=True)
        
        # transform form data to database format based on section/part
        db_data = {}
        
        if section_index == 0:  # Personal Data
            if part_index == 0:
                db_data = transform_personal_data_a(form_data)
            elif part_index == 1:
                db_data = transform_personal_data_b(form_data)
            elif part_index == 2:
                db_data = transform_personal_data_c(form_data)
        
        elif section_index == 1:  # Family Data
            if part_index == 0:
                db_data = transform_family_data_a(form_data)
            elif part_index == 1:
                db_data = transform_family_data_b(form_data)
        
        # always include auth_user_id
        db_data["auth_user_id"] = user_id
        
        # check if record exists
        existing_response = (
            supabase.table("students")
            .select("id")
            .eq("auth_user_id", user_id)
            .execute()
        )
        
        if existing_response.data:
            # update existing record
            update_response = (
                supabase.table("students")
                .update(db_data)
                .eq("auth_user_id", user_id)
                .execute()
            )
            result_id = existing_response.data[0]["id"]
        else:
            # insert new record
            insert_response = (
                supabase.table("students")
                .insert(db_data)
                .execute()
            )
            result_id = insert_response.data[0]["id"] if insert_response.data else None
            
            # update profiles.student_profile_id after creating student record
            if result_id:
                try:
                    supabase.table("profiles").update({
                        "student_profile_id": result_id
                    }).eq("id", user_id).execute()
                except Exception:
                    pass  # Don't fail if this fails
        
        # check and update completion flags
        if result_id:
            full_record_response = (
                supabase.table("students")
                .select("*")
                .eq("auth_user_id", user_id)
                .execute()
            )
            
            if full_record_response.data:
                full_record = full_record_response.data[0]
                update_flags = {}
                
                if section_index == 0 and check_personal_data_complete(full_record):
                    update_flags["is_personal_data_complete"] = True
                
                if section_index == 1 and check_family_data_complete(full_record):
                    update_flags["is_family_data_complete"] = True
                
                if update_flags:
                    supabase.table("students").update(update_flags).eq("auth_user_id", user_id).execute()
        
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@students_bp.route("/profile", methods=["GET"])
@require_auth
def get_student_profile(user_id: str):
    """Get full student profile (all sections)"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        
        response = (
            supabase.table("students")
            .select("*")
            .eq("auth_user_id", user_id)
            .execute()
        )
        
        if not response.data:
            return jsonify({"data": None}), 200
        
        return jsonify({"data": response.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

