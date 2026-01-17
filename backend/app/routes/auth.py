from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.otp import OTP
from app.schemas.auth import Signup, Login, OTPVerify
from app.schemas.auth import ForgotPassword
from app.utils.security import (
    hash_password,
    verify_password,
    create_jwt,
    generate_otp,
    send_email
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(data: Signup, db: Session = Depends(get_db)):
    print("SIGNUP HIT:", data.email)

    # check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(data.password)

    user = User(
        email=data.email,
        password=hashed_password
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        print("DB ERROR:", e)
        raise HTTPException(status_code=500, detail="Database error")

    token = create_jwt({"email": user.email})
    return {"token": token}


@router.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"token": create_jwt({"email": user.email})}

@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()

    db_otp = OTP(
        email=data.email,
        code=otp
    )

    db.add(db_otp)
    db.commit()

    send_email(data.email, otp)

    return {"message": "OTP sent to your email"}


@router.post("/reset-password")
def reset_password(data: OTPVerify, db: Session = Depends(get_db)):
    record = db.query(OTP).filter(
        OTP.email == data.email,
        OTP.code == data.otp   # ✅ FIXED
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = db.query(User).filter(User.email == data.email).first()
    user.password = hash_password(data.new_password)

    db.delete(record)
    db.commit()

    return {"message": "Password reset successful"}
