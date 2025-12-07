import os
from dotenv import load_dotenv

# environment & Supabase config

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1", "t"]

    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # Google Calendar OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/api/calendar/oauth/callback")
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")  # Fernet encryption key for tokens