from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)

def seed_data():
    from models import Specialty, Doctor
    db = SessionLocal()

    if db.query(Specialty).count() == 0:
        specialties = [
            Specialty(name="Cardiología", description="Especialista en corazón y sistema cardiovascular"),
            Specialty(name="Pediatría", description="Especialista en salud infantil"),
            Specialty(name="Dermatología", description="Especialista en piel y tejidos relacionados"),
            Specialty(name="Medicina General", description="Atención médica general"),
            Specialty(name="Psicología", description="Especialista en salud mental"),
            Specialty(name="Traumatología", description="Especialista en huesos, músculos y articulaciones"),
            Specialty(name="Ginecología", description="Especialista en salud femenina"),
            Specialty(name="Oftalmología", description="Especialista en ojos y visión"),
            Specialty(name="Neurología", description="Especialista en sistema nervioso"),
            Specialty(name="Nutrición", description="Especialista en alimentación y dieta"),
        ]
        db.add_all(specialties)
        db.commit()

        for specialty in specialties:
            db.refresh(specialty)

        doctors_data = [
            {"name": "Dr. Carlos Mendoza", "specialty_id": specialties[0].id, "rating": 4.8, "experience_years": 15, "price": 80.0, "photo_url": "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg"},
            {"name": "Dra. María López", "specialty_id": specialties[0].id, "rating": 4.9, "experience_years": 12, "price": 90.0, "photo_url": "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"},
            {"name": "Dr. Juan García", "specialty_id": specialties[1].id, "rating": 4.7, "experience_years": 10, "price": 70.0, "photo_url": "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"},
            {"name": "Dra. Ana Torres", "specialty_id": specialties[1].id, "rating": 4.9, "experience_years": 8, "price": 75.0, "photo_url": "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg"},
            {"name": "Dr. Luis Ramírez", "specialty_id": specialties[2].id, "rating": 4.6, "experience_years": 14, "price": 85.0, "photo_url": "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg"},
            {"name": "Dra. Sofia Vargas", "specialty_id": specialties[2].id, "rating": 4.8, "experience_years": 9, "price": 80.0, "photo_url": "https://images.pexels.com/photos/7447015/pexels-photo-7447015.jpeg"},
            {"name": "Dr. Pedro Sánchez", "specialty_id": specialties[3].id, "rating": 4.5, "experience_years": 20, "price": 60.0, "photo_url": "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg"},
            {"name": "Dra. Carmen Ruiz", "specialty_id": specialties[3].id, "rating": 4.7, "experience_years": 11, "price": 65.0, "photo_url": "https://images.pexels.com/photos/8460300/pexels-photo-8460300.jpeg"},
            {"name": "Dr. Roberto Díaz", "specialty_id": specialties[4].id, "rating": 4.9, "experience_years": 13, "price": 95.0, "photo_url": "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg"},
            {"name": "Dra. Isabel Morales", "specialty_id": specialties[4].id, "rating": 4.8, "experience_years": 10, "price": 90.0, "photo_url": "https://images.pexels.com/photos/7447295/pexels-photo-7447295.jpeg"},
            {"name": "Dr. Fernando Castro", "specialty_id": specialties[5].id, "rating": 4.7, "experience_years": 16, "price": 85.0, "photo_url": "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg"},
            {"name": "Dra. Laura Jiménez", "specialty_id": specialties[6].id, "rating": 4.9, "experience_years": 12, "price": 88.0, "photo_url": "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"},
            {"name": "Dr. Miguel Herrera", "specialty_id": specialties[7].id, "rating": 4.6, "experience_years": 11, "price": 82.0, "photo_url": "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg"},
            {"name": "Dra. Patricia Ortiz", "specialty_id": specialties[8].id, "rating": 4.8, "experience_years": 14, "price": 92.0, "photo_url": "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg"},
            {"name": "Dr. Andrés Silva", "specialty_id": specialties[9].id, "rating": 4.7, "experience_years": 9, "price": 70.0, "photo_url": "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg"},
        ]

        doctors = [Doctor(**doc_data) for doc_data in doctors_data]
        db.add_all(doctors)
        db.commit()

    db.close()
