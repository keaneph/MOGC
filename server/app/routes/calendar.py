"""
Google Calendar OAuth and sync routes
"""
from flask import Blueprint, request, jsonify, redirect
from app.utils.auth import require_auth
from app.services.google_calendar_service import get_calendar_service
from app.services.supabase_service import get_supabase_client
from google_auth_oauthlib.flow import Flow
from datetime import datetime, timezone
import os
from config import Config

calendar_bp = Blueprint("calendar", __name__, url_prefix="/api/calendar")


@calendar_bp.route("/oauth/authorize", methods=["GET"])
@require_auth
def authorize_google_calendar(user_id: str):
    """Initiate Google OAuth flow for Calendar access"""
    try:
        # Check if credentials are configured
        if not all([Config.GOOGLE_CLIENT_ID, Config.GOOGLE_CLIENT_SECRET, Config.ENCRYPTION_KEY]):
            missing = []
            if not Config.GOOGLE_CLIENT_ID:
                missing.append("GOOGLE_CLIENT_ID")
            if not Config.GOOGLE_CLIENT_SECRET:
                missing.append("GOOGLE_CLIENT_SECRET")
            if not Config.ENCRYPTION_KEY:
                missing.append("ENCRYPTION_KEY")
            
            return jsonify({
                "error": "Google Calendar credentials not configured",
                "message": f"Missing environment variables: {', '.join(missing)}",
                "help": "See QUICK_SETUP_GOOGLE_CALENDAR.md for setup instructions"
            }), 500
        
        service = get_calendar_service()
        
        # Create OAuth flow
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": Config.GOOGLE_CLIENT_ID,
                    "client_secret": Config.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [Config.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=service.SCOPES
        )
        flow.redirect_uri = Config.GOOGLE_REDIRECT_URI
        
        # Generate authorization URL
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent',  # Force consent to get refresh token
            state=user_id  # Store user_id in state for callback
        )
        
        return jsonify({
            "authorization_url": authorization_url,
            "state": state
        }), 200
    
    except Exception as e:
        print(f"Error initiating OAuth: {e}")
        return jsonify({"error": str(e)}), 500


@calendar_bp.route("/oauth/callback", methods=["GET"])
def oauth_callback():
    """Handle Google OAuth callback"""
    try:
        code = request.args.get('code')
        state = request.args.get('state')  # Contains user_id
        error = request.args.get('error')
        
        if error:
            return jsonify({"error": f"OAuth error: {error}"}), 400
        
        if not code or not state:
            return jsonify({"error": "Missing code or state"}), 400
        
        user_id = state  # We stored user_id in state
        
        service = get_calendar_service()
        
        # Create flow and exchange code for tokens
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": Config.GOOGLE_CLIENT_ID,
                    "client_secret": Config.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [Config.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=service.SCOPES
        )
        flow.redirect_uri = Config.GOOGLE_REDIRECT_URI
        
        # Exchange authorization code for tokens
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Store tokens
        expires_at = None
        if credentials.expiry:
            expires_at = credentials.expiry
        
        success = service.store_tokens(
            user_id=user_id,
            refresh_token=credentials.refresh_token,
            access_token=credentials.token,
            expires_at=expires_at
        )
        
        if not success:
            return jsonify({"error": "Failed to store tokens"}), 500
        
        # Redirect to frontend success page
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return redirect(f"{frontend_url}/student/calendar-of-events?connected=true")
    
    except Exception as e:
        print(f"Error in OAuth callback: {e}")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return redirect(f"{frontend_url}/student/calendar-of-events?error=oauth_failed")


@calendar_bp.route("/status", methods=["GET"])
@require_auth
def get_calendar_status(user_id: str):
    """Get user's Google Calendar sync status"""
    try:
        supabase = get_supabase_client(use_service_role=True)
        service = get_calendar_service()
        
        response = supabase.table("google_calendar_tokens").select(
            "sync_enabled, last_sync_at, created_at"
        ).eq("user_id", user_id).single().execute()
        
        if not response.data:
            return jsonify({
                "connected": False,
                "sync_enabled": False
            }), 200
        
        data = response.data
        return jsonify({
            "connected": True,
            "sync_enabled": data.get("sync_enabled", True),
            "last_sync_at": data.get("last_sync_at"),
            "connected_at": data.get("created_at")
        }), 200
    
    except Exception as e:
        # User not connected (no record found)
        if "No rows" in str(e) or "not found" in str(e).lower():
            return jsonify({
                "connected": False,
                "sync_enabled": False
            }), 200
        return jsonify({"error": str(e)}), 500


@calendar_bp.route("/disconnect", methods=["POST"])
@require_auth
def disconnect_calendar(user_id: str):
    """Disconnect Google Calendar and revoke tokens"""
    try:
        service = get_calendar_service()
        success = service.revoke_tokens(user_id)
        
        if success:
            return jsonify({"message": "Google Calendar disconnected successfully"}), 200
        else:
            return jsonify({"error": "Failed to disconnect"}), 500
    
    except Exception as e:
        print(f"Error disconnecting calendar: {e}")
        return jsonify({"error": str(e)}), 500


@calendar_bp.route("/sync-now", methods=["POST"])
@require_auth
def sync_now(user_id: str):
    """Manually trigger a calendar sync (future: sync all appointments)"""
    try:
        # For now, just update last_sync_at kay mao ra makaya
        supabase = get_supabase_client(use_service_role=True)
        supabase.table("google_calendar_tokens").update({
            "last_sync_at": datetime.now(timezone.utc).isoformat()
        }).eq("user_id", user_id).execute()
        
        return jsonify({"message": "Sync completed"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

