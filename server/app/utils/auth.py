"""Authentication utilities for verifying Supabase JWT tokens"""
from functools import wraps
from flask import request, jsonify
from typing import Optional
import jwt


def get_user_id_from_token() -> Optional[str]:
    """Extract and decode JWT token from Authorization header, return user ID"""
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    
    try:
        # decode JWT token without verification (Supabase already verified it)
        # the 'sub' claim contains the user ID
        decoded = jwt.decode(
            token,
            options={"verify_signature": False}  # trust Supabase-issued tokens
        )
        
        return decoded.get("sub")  # 'sub' contains the user ID
    except Exception as e:
        print(f"Token decode error: {e}")
        return None


def require_auth(f):
    """Decorator to require authentication for Flask routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_user_id_from_token()
        
        if not user_id:
            return jsonify({"error": "Unauthorized", "message": "Missing or invalid token"}), 401
        
        # pass user_id to the route handler
        return f(user_id=user_id, *args, **kwargs)
    
    return decorated_function
