from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from uuid import UUID
from typing import Optional

class UserCreate(BaseModel):
    id: Optional[UUID] = None  # When set (e.g. by auth service), use this as user id to link with auth_users
    first_name: str
    last_name: str
    dni: str
    email: EmailStr
    phone: Optional[str] = None
    birth_date: Optional[date] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dni: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    birth_date: Optional[date] = None

class UserResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    dni: str
    email: str
    phone: Optional[str]
    birth_date: Optional[date]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
