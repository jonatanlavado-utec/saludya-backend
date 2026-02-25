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
            {"id": "e1a72605-6a58-47bc-9b6f-4770fc60f47e", "name": "Dra. María García López", "specialty_id": specialties[0].id, "rating": 4.9, "experience_years": 15, "price": 50.0, "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face"},
            {"id": "4d98d28a-7517-4560-8438-66db00244675", "name": "Dr. Carlos Rodríguez Sánchez", "specialty_id": specialties[2].id, "rating": 4.8, "experience_years": 20, "price": 80.0, "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"},
            {"id": "78235213-9a3b-4819-863d-498c1cd81711", "name": "Dra. Ana Martínez Ruiz", "specialty_id": specialties[1].id, "rating": 4.95, "experience_years": 12, "price": 60.0, "photo_url": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face"},
            {"id": "b863a3c9-0261-41bd-8c76-50851f5e27fb", "name": "Dr. Luis Fernández Torres", "specialty_id": specialties[3].id, "rating": 4.7, "experience_years": 8, "price": 70.0, "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face"},
            {"id": "f8a0322c-5690-4d57-8fb6-829d660e5b0b", "name": "Dra. Patricia Gómez Vega", "specialty_id": specialties[4].id, "rating": 4.85, "experience_years": 18, "price": 75.0, "photo_url": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face"},
            {"id": "2c8a705e-a89f-43b9-a417-2fb078b54203", "name": "Dr. Roberto Díaz Mendoza", "specialty_id": specialties[5].id, "rating": 4.6, "experience_years": 22, "price": 85.0, "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face"},
            {"id": "e0c5c678-5db6-4299-9730-1be66fbab6f2", "name": "Dra. Elena Castro Navarro", "specialty_id": specialties[6].id, "rating": 4.9, "experience_years": 16, "price": 90.0, "photo_url": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=face"},
            {"id": "11c42f02-cd6e-44dc-9d8d-bb35d21c3b1e", "name": "Dr. Miguel Herrera Blanco", "specialty_id": specialties[7].id, "rating": 4.75, "experience_years": 14, "price": 65.0, "photo_url": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face"},
            {"id": "c369fc6a-2f47-49a3-9a8c-9c98bc0eeb13", "name": "Dra. Laura Jiménez Ortega", "specialty_id": specialties[8].id, "rating": 4.92, "experience_years": 10, "price": 55.0, "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face"},
            {"id": "9f05e263-ea7c-4ab4-9721-3fc75fbfa9c7", "name": "Dr. Antonio Morales Prieto", "specialty_id": specialties[9].id, "rating": 4.8, "experience_years": 7, "price": 45.0, "photo_url": "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=200&h=200&fit=crop&crop=face"}
        ]

        doctors = [Doctor(**doc_data) for doc_data in doctors_data]
        db.add_all(doctors)
        db.commit()

    db.close()
