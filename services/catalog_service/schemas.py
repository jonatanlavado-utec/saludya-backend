from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class SpecialtyResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class DoctorResponse(BaseModel):
    id: UUID
    name: str
    specialty_id: UUID
    specialty_name: Optional[str] = None
    rating: float
    experience_years: int
    price: float
    photo_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
