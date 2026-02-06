from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class OrientationRequest(BaseModel):
    symptoms: str
    user_id: Optional[UUID] = None

class OrientationResponse(BaseModel):
    id: UUID
    symptoms: str
    recommended_specialty: str
    confidence: str
    explanation: str
    created_at: datetime

    class Config:
        from_attributes = True
