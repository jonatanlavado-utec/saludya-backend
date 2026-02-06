from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Specialty(Base):
    __tablename__ = "specialties"
    __table_args__ = {'schema': 'catalog_service'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctors = relationship("Doctor", back_populates="specialty")

class Doctor(Base):
    __tablename__ = "doctors"
    __table_args__ = {'schema': 'catalog_service'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    specialty_id = Column(UUID(as_uuid=True), ForeignKey('catalog_service.specialties.id'), nullable=False)
    rating = Column(Float, default=0.0)
    experience_years = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    specialty = relationship("Specialty", back_populates="doctors")
