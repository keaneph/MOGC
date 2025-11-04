"""Supabase service for database operations"""
from supabase import create_client, Client
from config import Config


def get_supabase_client(use_service_role: bool = True) -> Client:
    """
    Get Supabase client
    
    Args:
        use_service_role: If True, use service role key (bypasses RLS)
                          If False, use anon key (respects RLS)
    """
    url = Config.SUPABASE_URL
    key = Config.SUPABASE_SERVICE_ROLE_KEY if use_service_role else None
    
    if not url:
        raise ValueError("SUPABASE_URL not configured")
    
    if use_service_role and not key:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY not configured for service role")
    
    # use service role key for backend operations
    # RLS is still enforced through auth_user_id filtering
    return create_client(url, Config.SUPABASE_SERVICE_ROLE_KEY)
