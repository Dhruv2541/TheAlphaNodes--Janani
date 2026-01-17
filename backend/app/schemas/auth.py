from pydantic import BaseModel, EmailStr

class Signup(BaseModel):
    email: EmailStr
    password: str

class Login(BaseModel):
    email: EmailStr
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class ForgotPassword(BaseModel):
    email: EmailStr
