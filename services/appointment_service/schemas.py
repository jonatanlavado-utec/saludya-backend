from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class AppointmentCreate(BaseModel):
    user_id: UUID
    doctor_id: UUID
    doctor_name: str
    specialty_name: str
    appointment_date: datetime
    price: float
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    doctor_id: UUID
    doctor_name: str
    specialty_name: str
    appointment_date: datetime
    price: float
    status: str
    payment_id: Optional[UUID]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
