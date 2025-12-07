#!/usr/bin/env python3
"""
Quick script to check if Google Calendar environment variables are configured
Run this from the server directory: python check_google_config.py
"""
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

print("=" * 60)
print("Google Calendar Configuration Check")
print("=" * 60)
print()

# Check each required variable
required_vars = {
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
    "GOOGLE_REDIRECT_URI": os.getenv("GOOGLE_REDIRECT_URI"),
    "ENCRYPTION_KEY": os.getenv("ENCRYPTION_KEY"),
}

optional_vars = {
    "FRONTEND_URL": os.getenv("FRONTEND_URL", "http://localhost:3000"),
}

all_good = True

print("Required Variables:")
print("-" * 60)
for var_name, var_value in required_vars.items():
    if var_value:
        # Mask sensitive values
        if "SECRET" in var_name or "KEY" in var_name:
            display_value = f"{var_value[:10]}...{var_value[-5:]}" if len(var_value) > 15 else "***"
        else:
            display_value = var_value
        print(f"{var_name}: {display_value}")
    else:
        print(f"{var_name}: NOT SET")
        all_good = False

print()
print("Optional Variables:")
print("-" * 60)
for var_name, var_value in optional_vars.items():
    if var_value:
        print(f"{var_name}: {var_value}")
    else:
        print(f"{var_name}: NOT SET (using default)")

print()
print("=" * 60)

if all_good:
    print("All required variables are set!")
    print()
    print("Testing encryption key...")
    try:
        from cryptography.fernet import Fernet
        key = os.getenv("ENCRYPTION_KEY")
        if key:
            Fernet(key.encode())
            print("Encryption key is valid")
        else:
            print("Encryption key is missing")
    except Exception as e:
        print(f"Encryption key is invalid: {e}")
        print("   Generate a new one with:")
        print("   python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"")
else:
    print("Check env vars guys")

print("=" * 60)

