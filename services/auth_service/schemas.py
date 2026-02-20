from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    id: UUID
    email: str
    token: str
    created_at: datetime

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    id: UUID
    email: str
    token: str
    message: str

    class Config:
        from_attributes = True

class MeResponse(BaseModel):
    id: UUID
    email: str

    class Config:
        from_attributes = True
