from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserUpdate, UserResponse
from uuid import UUID
from datetime import datetime

user_router = APIRouter()

@user_router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_dni = db.query(User).filter(User.dni == user.dni).first()
    if existing_dni:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="DNI already registered"
        )

    data = user.model_dump()
    if data.get("id") is None:
        del data["id"]
    new_user = User(**data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@user_router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user

@user_router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    update_data = user_update.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"] != user.email:
        existing = db.query(User).filter(User.email == update_data["email"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    if "dni" in update_data and update_data["dni"] != user.dni:
        existing = db.query(User).filter(User.dni == update_data["dni"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DNI already registered"
            )

    for key, value in update_data.items():
        setattr(user, key, value)

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    return user
