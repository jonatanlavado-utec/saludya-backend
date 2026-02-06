from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Specialty, Doctor
from schemas import SpecialtyResponse, DoctorResponse
from typing import List, Optional
from uuid import UUID

catalog_router = APIRouter()

@catalog_router.get("/specialties", response_model=List[SpecialtyResponse])
def get_specialties(db: Session = Depends(get_db)):
    specialties = db.query(Specialty).all()
    return specialties

@catalog_router.get("/doctors", response_model=List[DoctorResponse])
def get_doctors(
    specialty_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)

    if specialty_id:
        query = query.filter(Doctor.specialty_id == specialty_id)

    doctors = query.all()

    result = []
    for doctor in doctors:
        doctor_dict = {
            "id": doctor.id,
            "name": doctor.name,
            "specialty_id": doctor.specialty_id,
            "specialty_name": doctor.specialty.name if doctor.specialty else None,
            "rating": doctor.rating,
            "experience_years": doctor.experience_years,
            "price": doctor.price,
            "photo_url": doctor.photo_url,
            "created_at": doctor.created_at
        }
        result.append(DoctorResponse(**doctor_dict))

    return result

@catalog_router.get("/doctors/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: UUID, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    doctor_dict = {
        "id": doctor.id,
        "name": doctor.name,
        "specialty_id": doctor.specialty_id,
        "specialty_name": doctor.specialty.name if doctor.specialty else None,
        "rating": doctor.rating,
        "experience_years": doctor.experience_years,
        "price": doctor.price,
        "photo_url": doctor.photo_url,
        "created_at": doctor.created_at
    }

    return DoctorResponse(**doctor_dict)
