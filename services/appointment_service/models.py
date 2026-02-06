from sqlalchemy import Column, String, DateTime, Float, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime
import enum

class AppointmentStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = {'schema': 'appointment_service'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    doctor_id = Column(UUID(as_uuid=True), nullable=False)
    doctor_name = Column(String, nullable=False)
    specialty_name = Column(String, nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.PENDING)
    payment_id = Column(UUID(as_uuid=True), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
