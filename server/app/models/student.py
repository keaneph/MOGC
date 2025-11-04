"""Student data models and transformations"""
from typing import Dict, Any, Optional, Literal
from datetime import datetime

# type aliases
SectionIndex = Literal[0, 1, 2, 3, 4, 5]
PartIndex = Literal[0, 1, 2]


def convert_status_to_boolean(status: str) -> bool:
    """Convert form status to database boolean"""
    return status == "Deceased"


def convert_boolean_to_status(deceased: Optional[bool]) -> str:
    """Convert database boolean to form status"""
    return "Deceased" if deceased else "Living"


def convert_medical_condition(condition: Optional[str]) -> Optional[str]:
    """Convert form medical condition to database format"""
    return "Existing" if condition == "Existing" else None


def convert_medical_condition_from_db(condition: Optional[str]) -> str:
    """Convert database medical condition to form format"""
    return "Existing" if condition == "Existing" else "None"


def transform_personal_data_a(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform Personal Data Part A form data to database format"""
    return {
        "id_number": form_data.get("idNo"),
        "course": form_data.get("course"),
        "msu_sase_score": form_data.get("saseScore"),
        "academic_year": form_data.get("academicYear"),
        "family_name": form_data.get("familyName"),
        "given_name": form_data.get("givenName"),
        "middle_initial": form_data.get("middleInitial"),
        "student_status": form_data.get("studentStatus"),
        "nickname": form_data.get("nickname"),
        "age": form_data.get("age"),
        "sex": form_data.get("sex"),
        "citizenship": form_data.get("citizenship"),
        "date_of_birth": form_data.get("dateOfBirth"),
        "place_of_birth": form_data.get("placeOfBirth"),
    }


def transform_personal_data_b(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform Personal Data Part B form data to database format"""
    return {
        "religious_affiliation": form_data.get("religiousAffiliation"),
        "civil_status": form_data.get("civilStatus"),
        "civil_status_others": form_data.get("otherCivilStatus"),
        "number_of_children": form_data.get("noOfChildren"),
        "address_iligan": form_data.get("addressInIligan"),
        "contact_number": form_data.get("contactNo"),
        "home_address": form_data.get("homeAddress"),
        "stays_with": form_data.get("staysWith"),
        "working_student_status": form_data.get("workingStudent"),
        "talents_skills": form_data.get("talentsAndSkills"),
    }


def transform_personal_data_c(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform Personal Data Part C form data to database format"""
    serious_medical_condition = form_data.get("seriousMedicalCondition") or "None"
    physical_disability = form_data.get("physicalDisability") or "None"
    
    return {
        "leisure_activities": form_data.get("leisureAndRecreationalActivities"),
        "medical_condition": convert_medical_condition(serious_medical_condition),
        "medical_condition_others": None if serious_medical_condition == "None" else form_data.get("otherSeriousMedicalCondition"),
        "physical_disability": convert_medical_condition(physical_disability),
        "physical_disability_others": None if physical_disability == "None" else form_data.get("otherPhysicalDisability"),
        "gender_identity": form_data.get("genderIdentity"),
        "attraction": form_data.get("sexualAttraction"),
    }


def transform_family_data_a(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform Family Data Part A form data to database format"""
    return {
        "father_name": form_data.get("fathersName"),
        "father_deceased": convert_status_to_boolean(form_data.get("fathersStatus", "Living")),
        "father_occupation": form_data.get("fathersOccupation"),
        "father_contact_number": form_data.get("fathersContactNo"),
        "mother_name": form_data.get("mothersName"),
        "mother_deceased": convert_status_to_boolean(form_data.get("mothersStatus", "Living")),
        "mother_occupation": form_data.get("mothersOccupation"),
        "mother_contact_number": form_data.get("mothersContactNo"),
        "parents_marital_status": form_data.get("parentsMaritalStatus"),
        "family_monthly_income": form_data.get("familyMonthlyIncome"),
    }


def transform_family_data_b(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform Family Data Part B form data to database format"""
    return {
        "guardian_name": form_data.get("guardianName"),
        "guardian_occupation": form_data.get("guardianOccupation"),
        "guardian_contact_number": form_data.get("guardianContactNo"),
        "guardian_relationship": form_data.get("relationshipWithGuardian"),
        "ordinal_position": form_data.get("ordinalPosition"),
        "number_of_siblings": form_data.get("noOfSiblings"),
        "home_environment_description": form_data.get("describeEnvironment"),
    }


def transform_from_personal_data_a(db_record: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database record to Personal Data Part A form format"""
    return {
        "idNo": db_record.get("id_number"),
        "course": db_record.get("course"),
        "saseScore": db_record.get("msu_sase_score"),
        "academicYear": db_record.get("academic_year"),
        "familyName": db_record.get("family_name"),
        "givenName": db_record.get("given_name"),
        "middleInitial": db_record.get("middle_initial"),
        "studentStatus": db_record.get("student_status"),
        "nickname": db_record.get("nickname"),
        "age": db_record.get("age"),
        "sex": db_record.get("sex"),
        "citizenship": db_record.get("citizenship"),
        "dateOfBirth": db_record.get("date_of_birth"),
        "placeOfBirth": db_record.get("place_of_birth"),
    }


def transform_from_personal_data_b(db_record: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database record to Personal Data Part B form format"""
    return {
        "religiousAffiliation": db_record.get("religious_affiliation"),
        "civilStatus": db_record.get("civil_status"),
        "otherCivilStatus": db_record.get("civil_status_others"),
        "noOfChildren": db_record.get("number_of_children"),
        "addressInIligan": db_record.get("address_iligan"),
        "contactNo": db_record.get("contact_number"),
        "homeAddress": db_record.get("home_address"),
        "staysWith": db_record.get("stays_with"),
        "workingStudent": db_record.get("working_student_status"),
        "talentsAndSkills": db_record.get("talents_skills"),
    }


def transform_from_personal_data_c(db_record: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database record to Personal Data Part C form format"""
    serious_medical_condition = convert_medical_condition_from_db(db_record.get("medical_condition"))
    physical_disability = convert_medical_condition_from_db(db_record.get("physical_disability"))
    
    return {
        "leisureAndRecreationalActivities": db_record.get("leisure_activities"),
        "seriousMedicalCondition": serious_medical_condition,
        "otherSeriousMedicalCondition": "" if serious_medical_condition == "None" else db_record.get("medical_condition_others") or "",
        "physicalDisability": physical_disability,
        "otherPhysicalDisability": "" if physical_disability == "None" else db_record.get("physical_disability_others") or "",
        "genderIdentity": db_record.get("gender_identity"),
        "sexualAttraction": db_record.get("attraction"),
    }


def transform_from_family_data_a(db_record: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database record to Family Data Part A form format"""
    return {
        "fathersName": db_record.get("father_name"),
        "fathersStatus": convert_boolean_to_status(db_record.get("father_deceased")),
        "fathersOccupation": db_record.get("father_occupation"),
        "fathersContactNo": db_record.get("father_contact_number"),
        "mothersName": db_record.get("mother_name"),
        "mothersStatus": convert_boolean_to_status(db_record.get("mother_deceased")),
        "mothersOccupation": db_record.get("mother_occupation"),
        "mothersContactNo": db_record.get("mother_contact_number"),
        "parentsMaritalStatus": db_record.get("parents_marital_status"),
        "familyMonthlyIncome": db_record.get("family_monthly_income"),
    }


def transform_from_family_data_b(db_record: Dict[str, Any]) -> Dict[str, Any]:
    """Convert database record to Family Data Part B form format"""
    return {
        "guardianName": db_record.get("guardian_name"),
        "guardianOccupation": db_record.get("guardian_occupation"),
        "guardianContactNo": db_record.get("guardian_contact_number"),
        "relationshipWithGuardian": db_record.get("guardian_relationship"),
        "ordinalPosition": db_record.get("ordinal_position"),
        "noOfSiblings": db_record.get("number_of_siblings"),
        "describeEnvironment": db_record.get("home_environment_description"),
    }


def check_personal_data_complete(db_record: Dict[str, Any]) -> bool:
    """Check if all parts of Personal Data section are complete"""
    part_a_complete = (
        db_record.get("id_number") and
        db_record.get("course") and
        db_record.get("msu_sase_score") is not None and
        db_record.get("academic_year") and
        db_record.get("family_name") and
        db_record.get("given_name") and
        db_record.get("middle_initial") and
        db_record.get("student_status") and
        db_record.get("nickname") and
        db_record.get("age") is not None and
        db_record.get("sex") and
        db_record.get("citizenship") and
        db_record.get("date_of_birth") and
        db_record.get("place_of_birth")
    )
    
    part_b_complete = (
        db_record.get("religious_affiliation") and
        db_record.get("civil_status") and
        (db_record.get("civil_status") != "Others" or db_record.get("civil_status_others")) and
        db_record.get("number_of_children") is not None and
        db_record.get("address_iligan") and
        db_record.get("contact_number") and
        db_record.get("home_address") and
        db_record.get("stays_with") and
        db_record.get("working_student_status") and
        db_record.get("talents_skills")
    )
    
    part_c_complete = (
        db_record.get("leisure_activities") and
        (db_record.get("medical_condition") != "Existing" or db_record.get("medical_condition_others")) and
        (db_record.get("physical_disability") != "Existing" or db_record.get("physical_disability_others")) and
        db_record.get("gender_identity") and
        db_record.get("attraction")
    )
    
    return part_a_complete and part_b_complete and part_c_complete


def check_family_data_complete(db_record: Dict[str, Any]) -> bool:
    """Check if all parts of Family Data section are complete"""
    part_a_complete = (
        db_record.get("father_name") and
        db_record.get("father_deceased") is not None and
        db_record.get("father_occupation") and
        db_record.get("father_contact_number") and
        db_record.get("mother_name") and
        db_record.get("mother_deceased") is not None and
        db_record.get("mother_occupation") and
        db_record.get("mother_contact_number") and
        db_record.get("parents_marital_status") and
        db_record.get("family_monthly_income")
    )
    
    part_b_complete = (
        db_record.get("guardian_name") and
        db_record.get("guardian_occupation") and
        db_record.get("guardian_contact_number") and
        db_record.get("guardian_relationship") and
        db_record.get("ordinal_position") and
        db_record.get("number_of_siblings") is not None and
        db_record.get("home_environment_description")
    )
    
    return part_a_complete and part_b_complete

