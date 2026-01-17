import os
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta

from passlib.context import CryptContext
from jose import jwt

# ---------------- PASSWORD HASHING ----------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

# ---------------- JWT ----------------

def create_jwt(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=60)
    return jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

# ---------------- OTP ----------------

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

# ---------------- EMAIL ----------------

def send_email(to_email: str, otp: str):
    msg = MIMEText(f"Your Janani OTP is: {otp}")
    msg["Subject"] = "Janani Password Reset OTP"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email

    server = smtplib.SMTP(
        os.getenv("EMAIL_HOST"),
        int(os.getenv("EMAIL_PORT"))
    )
    server.starttls()
    server.login(
        os.getenv("EMAIL_USER"),
        os.getenv("EMAIL_PASSWORD")
    )
    server.send_message(msg)
    server.quit()
    print("📧 EMAIL FUNCTION HIT")
    print("TO:", to_email)
    print("OTP:", otp)

