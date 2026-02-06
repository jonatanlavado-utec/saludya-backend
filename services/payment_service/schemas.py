from pydantic import BaseModel, validator
from datetime import datetime
from uuid import UUID
from typing import Optional
import re

class PaymentRequest(BaseModel):
    user_id: UUID
    appointment_id: UUID
    amount: float
    card_number: str
    card_holder: str
    expiry_date: str
    cvv: str

    @validator('card_number')
    def validate_card_number(cls, v):
        v = v.replace(' ', '').replace('-', '')
        if not v.isdigit() or len(v) != 16:
            raise ValueError('Invalid card number')
        return v

    @validator('cvv')
    def validate_cvv(cls, v):
        if not v.isdigit() or len(v) not in [3, 4]:
            raise ValueError('Invalid CVV')
        return v

    @validator('expiry_date')
    def validate_expiry(cls, v):
        if not re.match(r'^\d{2}/\d{2}$', v):
            raise ValueError('Invalid expiry date format. Use MM/YY')
        return v

class PaymentResponse(BaseModel):
    id: UUID
    user_id: UUID
    appointment_id: UUID
    amount: float
    card_last_four: str
    card_type: str
    status: str
    transaction_id: str
    created_at: datetime
    message: str

    class Config:
        from_attributes = True
