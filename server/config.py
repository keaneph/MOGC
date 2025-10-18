import os
from dotenv import load_dotenv

# environment & Supabase config

load_dotenv()

class Config:
    DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1", "t"]

    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
