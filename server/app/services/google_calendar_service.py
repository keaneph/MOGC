"""
Google Calendar service for creating, updating, and deleting calendar events
"""
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from cryptography.fernet import Fernet
from app.services.supabase_service import get_supabase_client
from config import Config


class GoogleCalendarService:
    """Service for managing Google Calendar integration"""
    
    SCOPES = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ]
    
    def __init__(self):
        self.client_id = Config.GOOGLE_CLIENT_ID
        self.client_secret = Config.GOOGLE_CLIENT_SECRET
        self.redirect_uri = Config.GOOGLE_REDIRECT_URI
        self.encryption_key = Config.ENCRYPTION_KEY
        
        if not all([self.client_id, self.client_secret, self.encryption_key]):
            raise ValueError("Google Calendar credentials not configured")
        
        self.cipher = Fernet(self.encryption_key.encode())
    
    def encrypt_token(self, token: str) -> str:
        """Encrypt a token for storage"""
        return self.cipher.encrypt(token.encode()).decode()
    
    def decrypt_token(self, encrypted_token: str) -> str:
        """Decrypt a stored token"""
        return self.cipher.decrypt(encrypted_token.encode()).decode()
    
    def get_user_credentials(self, user_id: str) -> Optional[Credentials]:
        """
        Get valid Google OAuth credentials for a user
        Refreshes access token if needed
        """
        supabase = get_supabase_client(use_service_role=True)
        
        # Get user's tokens
        try:
            response = supabase.table("google_calendar_tokens").select(
                "refresh_token, access_token, token_expires_at"
            ).eq("user_id", user_id).single().execute()
            
            if not response.data:
                return None
        except Exception as e:
            # No token record found
            return None
        
        tokens = response.data
        refresh_token = self.decrypt_token(tokens["refresh_token"])
        
        # Build credentials
        creds = Credentials(
            token=tokens.get("access_token"),
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret
        )
        
        # Refresh if expired or missing
        if not creds.valid:
            try:
                creds.refresh(Request())
                
                # Update stored access token
                # creds.expiry is already a datetime, not a timedelta
                expires_at = creds.expiry
                supabase.table("google_calendar_tokens").update({
                    "access_token": creds.token,
                    "token_expires_at": expires_at.isoformat() if expires_at else None
                }).eq("user_id", user_id).execute()
            except Exception as e:
                print(f"Error refreshing token for user {user_id}: {e}")
                return None
        
        return creds
    
    def user_has_calendar_connected(self, user_id: str) -> bool:
        """Check if user has connected their Google Calendar"""
        supabase = get_supabase_client(use_service_role=True)
        response = supabase.table("google_calendar_tokens").select(
            "id, sync_enabled"
        ).eq("user_id", user_id).eq("sync_enabled", True).execute()
        return len(response.data) > 0
    
    def create_calendar_event(
        self,
        user_id: str,
        summary: str,
        description: str,
        start_datetime: str,  # ISO format: "2024-01-15T10:00:00"
        end_datetime: str,    # ISO format: "2024-01-15T11:00:00"
        timezone: str = "Asia/Manila",
        attendees: Optional[list] = None,
        location: Optional[str] = None
    ) -> Optional[str]:
        """
        Create a Google Calendar event
        Returns the event ID if successful, None otherwise
        """
        creds = self.get_user_credentials(user_id)
        if not creds:
            return None
        
        try:
            service = build('calendar', 'v3', credentials=creds)
            
            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_datetime,
                    'timeZone': timezone,
                },
                'end': {
                    'dateTime': end_datetime,
                    'timeZone': timezone,
                },
            }
            
            if attendees:
                event['attendees'] = [{'email': email} for email in attendees]
            
            if location:
                event['location'] = location
            
            created_event = service.events().insert(
                calendarId='primary',
                body=event
            ).execute()
            
            return created_event['id']
        
        except HttpError as e:
            print(f"Error creating calendar event: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error creating calendar event: {e}")
            return None
    
    def update_calendar_event(
        self,
        user_id: str,
        event_id: str,
        summary: Optional[str] = None,
        description: Optional[str] = None,
        start_datetime: Optional[str] = None,
        end_datetime: Optional[str] = None,
        timezone: str = "Asia/Manila",
        attendees: Optional[list] = None,
        location: Optional[str] = None
    ) -> bool:
        """Update an existing Google Calendar event"""
        creds = self.get_user_credentials(user_id)
        if not creds:
            return False
        
        try:
            service = build('calendar', 'v3', credentials=creds)
            
            # Get existing event
            event = service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()
            
            # Update fields
            if summary:
                event['summary'] = summary
            if description is not None:
                event['description'] = description
            if start_datetime:
                event['start'] = {
                    'dateTime': start_datetime,
                    'timeZone': timezone,
                }
            if end_datetime:
                event['end'] = {
                    'dateTime': end_datetime,
                    'timeZone': timezone,
                }
            if attendees is not None:
                event['attendees'] = [{'email': email} for email in attendees]
            if location is not None:
                event['location'] = location
            
            service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event
            ).execute()
            
            return True
        
        except HttpError as e:
            print(f"Error updating calendar event: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error updating calendar event: {e}")
            return False
    
    def delete_calendar_event(self, user_id: str, event_id: str) -> bool:
        """Delete a Google Calendar event"""
        creds = self.get_user_credentials(user_id)
        if not creds:
            print(f"No credentials found for user {user_id}, cannot delete event {event_id}")
            return False
        
        try:
            service = build('calendar', 'v3', credentials=creds)
            service.events().delete(
                calendarId='primary',
                eventId=event_id
            ).execute()
            print(f"Successfully deleted calendar event {event_id} for user {user_id}")
            return True
        
        except HttpError as e:
            if e.resp.status == 404:
                # Event already deleted, consider it success
                print(f"Calendar event {event_id} already deleted (404)")
                return True
            print(f"HTTP Error deleting calendar event {event_id}: {e.resp.status} - {e}")
            return False
        except Exception as e:
            print(f"Unexpected error deleting calendar event {event_id}: {type(e).__name__} - {e}")
            return False
    
    def store_tokens(
        self,
        user_id: str,
        refresh_token: str,
        access_token: Optional[str] = None,
        expires_at: Optional[datetime] = None
    ) -> bool:
        """Store encrypted tokens in database"""
        supabase = get_supabase_client(use_service_role=True)
        
        encrypted_refresh = self.encrypt_token(refresh_token)
        
        data = {
            "user_id": user_id,
            "refresh_token": encrypted_refresh,
            "sync_enabled": True,
            "last_sync_at": datetime.now(timezone.utc).isoformat()
        }
        
        if access_token:
            data["access_token"] = access_token
        if expires_at:
            data["token_expires_at"] = expires_at.isoformat()
        
        # Upsert (insert or update)
        response = supabase.table("google_calendar_tokens").upsert(
            data,
            on_conflict="user_id"
        ).execute()
        
        return len(response.data) > 0
    
    def revoke_tokens(self, user_id: str) -> bool:
        """Revoke Google OAuth tokens and remove from database"""
        supabase = get_supabase_client(use_service_role=True)
        
        # Get tokens to revoke
        response = supabase.table("google_calendar_tokens").select(
            "refresh_token"
        ).eq("user_id", user_id).single().execute()
        
        if response.data:
            try:
                # Revoke token with Google
                refresh_token = self.decrypt_token(response.data["refresh_token"])
                creds = Credentials(
                    token=None,
                    refresh_token=refresh_token,
                    token_uri="https://oauth2.googleapis.com/token",
                    client_id=self.client_id,
                    client_secret=self.client_secret
                )
                
                # Revoke the token
                import requests
                requests.post(
                    'https://oauth2.googleapis.com/revoke',
                    params={'token': refresh_token},
                    headers={'content-type': 'application/x-www-form-urlencoded'}
                )
            except Exception as e:
                print(f"Error revoking token: {e}")
                # Continue to delete from DB even if revocation fails
        
        # Delete from database
        supabase.table("google_calendar_tokens").delete().eq("user_id", user_id).execute()
        return True


# Singleton instance
_calendar_service = None

def get_calendar_service() -> GoogleCalendarService:
    """Get singleton Google Calendar service instance"""
    global _calendar_service
    if _calendar_service is None:
        _calendar_service = GoogleCalendarService()
    return _calendar_service

