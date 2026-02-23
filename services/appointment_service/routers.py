from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Appointment, AppointmentStatus
from schemas import AppointmentCreate, AppointmentResponse
from typing import List
from uuid import UUID
from datetime import datetime
from service_clients import UserServiceClient, CatalogServiceClient

appointment_router = APIRouter()


def get_user_client() -> UserServiceClient:
    return UserServiceClient()


def get_catalog_client() -> CatalogServiceClient:
    return CatalogServiceClient()


@appointment_router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    user_client: UserServiceClient = Depends(get_user_client),
    catalog_client: CatalogServiceClient = Depends(get_catalog_client)
):
    # Validate user exists via User Service API
    if not user_client.user_exists(appointment.user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found. Please provide a valid user ID."
        )

    # Validate doctor exists via Catalog Service API
    if not catalog_client.doctor_exists(appointment.doctor_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor not found. Please provide a valid doctor ID."
        )

    # Get doctor details for denormalized data
    doctor = catalog_client.get_doctor(appointment.doctor_id)

    new_appointment = Appointment(
        user_id=appointment.user_id,
        doctor_id=appointment.doctor_id,
        doctor_name=doctor["name"],
        specialty_name=doctor["specialty_name"],
        appointment_date=appointment.appointment_date,
        price=appointment.price,
        status=AppointmentStatus.CONFIRMED,
        payment_id=appointment.payment_id,
        notes=appointment.notes
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    response_dict = {
        "id": new_appointment.id,
        "user_id": new_appointment.user_id,
        "doctor_id": new_appointment.doctor_id,
        "doctor_name": new_appointment.doctor_name,
        "specialty_name": new_appointment.specialty_name,
        "appointment_date": new_appointment.appointment_date,
        "price": new_appointment.price,
        "status": new_appointment.status.value,
        "payment_id": new_appointment.payment_id,
        "notes": new_appointment.notes,
        "created_at": new_appointment.created_at,
        "updated_at": new_appointment.updated_at
    }

    return AppointmentResponse(**response_dict)

@appointment_router.get("/user/{user_id}", response_model=List[AppointmentResponse])
def get_user_appointments(user_id: UUID, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(
        Appointment.user_id == user_id
    ).order_by(Appointment.appointment_date.desc()).all()

    result = []
    for appointment in appointments:
        response_dict = {
            "id": appointment.id,
            "user_id": appointment.user_id,
            "doctor_id": appointment.doctor_id,
            "doctor_name": appointment.doctor_name,
            "specialty_name": appointment.specialty_name,
            "appointment_date": appointment.appointment_date,
            "price": appointment.price,
            "status": appointment.status.value,
            "payment_id": appointment.payment_id,
            "notes": appointment.notes,
            "created_at": appointment.created_at,
            "updated_at": appointment.updated_at
        }
        result.append(AppointmentResponse(**response_dict))

    return result

@appointment_router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: UUID, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    response_dict = {
        "id": appointment.id,
        "user_id": appointment.user_id,
        "doctor_id": appointment.doctor_id,
        "doctor_name": appointment.doctor_name,
        "specialty_name": appointment.specialty_name,
        "appointment_date": appointment.appointment_date,
        "price": appointment.price,
        "status": appointment.status.value,
        "payment_id": appointment.payment_id,
        "notes": appointment.notes,
        "created_at": appointment.created_at,
        "updated_at": appointment.updated_at
    }

    return AppointmentResponse(**response_dict)

@appointment_router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(appointment_id: UUID, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    if appointment.status == AppointmentStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment already cancelled"
        )

    if appointment.status == AppointmentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel completed appointment"
        )

    appointment.status = AppointmentStatus.CANCELLED
    appointment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)

    response_dict = {
        "id": appointment.id,
        "user_id": appointment.user_id,
        "doctor_id": appointment.doctor_id,
        "doctor_name": appointment.doctor_name,
        "specialty_name": appointment.specialty_name,
        "appointment_date": appointment.appointment_date,
        "price": appointment.price,
        "status": appointment.status.value,
        "payment_id": appointment.payment_id,
        "notes": appointment.notes,
        "created_at": appointment.created_at,
        "updated_at": appointment.updated_at
    }

    return AppointmentResponse(**response_dict)
