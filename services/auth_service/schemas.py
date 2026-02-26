from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from uuid import UUID
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    dni: str
    phone: Optional[str] = None
    birth_date: Optional[date] = None

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
