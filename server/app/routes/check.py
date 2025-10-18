from flask import Blueprint, jsonify

check_bp = Blueprint('check', __name__)

@check_bp.route("/")
def home():
    return jsonify({"message": "wakey wakey, flask is awakey"})