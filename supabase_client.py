import os
from dotenv import load_dotenv
from supabase import create_client

# Charger les variables du fichier bdd.env
load_dotenv("bdd.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def signup_user(email, password):
    return supabase.auth.sign_up({"email": email, "password": password})


def login_user(email, password):
    return supabase.auth.sign_in_with_password({"email": email, "password": password})


def reset_password_email(email, redirect_to=None):
    options = {"redirect_to": redirect_to} if redirect_to else None
    return supabase.auth.reset_password_for_email(email, options)