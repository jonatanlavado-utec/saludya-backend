from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models import OrientationQuery
from schemas import OrientationRequest, OrientationResponse
import re

ai_router = APIRouter()

SYMPTOM_KEYWORDS = {
    "Cardiología": [
        "dolor de pecho", "palpitaciones", "corazón", "presión arterial", "hipertensión",
        "taquicardia", "arritmia", "infarto", "cardiovascular", "dolor torácico"
    ],
    "Pediatría": [
        "niño", "bebé", "infantil", "vacuna", "desarrollo infantil", "fiebre en niños",
        "crecimiento", "lactancia", "pediátrico"
    ],
    "Dermatología": [
        "piel", "sarpullido", "acné", "manchas", "picazón", "dermatitis", "eczema",
        "urticaria", "psoriasis", "lunares", "erupción"
    ],
    "Psicología": [
        "ansiedad", "depresión", "estrés", "insomnio", "tristeza", "pánico", "miedo",
        "angustia", "mental", "emocional", "dormir"
    ],
    "Traumatología": [
        "fractura", "hueso", "dolor muscular", "esguince", "lesión", "articulación",
        "rodilla", "tobillo", "columna", "lumbar", "dolor de espalda", "contractura"
    ],
    "Ginecología": [
        "menstruación", "embarazo", "útero", "ovario", "vaginal", "menopausia",
        "ciclo menstrual", "anticonceptivos", "ginecológico"
    ],
    "Oftalmología": [
        "ojo", "visión", "vista", "ceguera", "conjuntivitis", "glaucoma", "cataratas",
        "miopía", "astigmatismo", "visual"
    ],
    "Neurología": [
        "dolor de cabeza", "migraña", "mareo", "vértigo", "convulsiones", "epilepsia",
        "parálisis", "temblor", "cerebro", "nervioso", "cefalea"
    ],
    "Nutrición": [
        "dieta", "peso", "obesidad", "adelgazar", "alimentación", "nutrición",
        "diabético", "colesterol", "triglicéridos", "metabolismo"
    ],
    "Medicina General": [
        "fiebre", "gripe", "tos", "resfriado", "dolor", "malestar", "fatiga", "cansancio"
    ]
}

def analyze_symptoms(symptoms: str) -> tuple:
    symptoms_lower = symptoms.lower()
    specialty_scores = {}

    for specialty, keywords in SYMPTOM_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in symptoms_lower:
                score += 1
        if score > 0:
            specialty_scores[specialty] = score

    if not specialty_scores:
        return "Medicina General", "media", "No se encontraron síntomas específicos, se recomienda consulta general"

    recommended_specialty = max(specialty_scores, key=specialty_scores.get)
    max_score = specialty_scores[recommended_specialty]

    if max_score >= 3:
        confidence = "alta"
        explanation = f"Los síntomas descritos tienen una fuerte relación con {recommended_specialty}"
    elif max_score >= 2:
        confidence = "media"
        explanation = f"Los síntomas descritos sugieren que podría necesitar {recommended_specialty}"
    else:
        confidence = "baja"
        explanation = f"Los síntomas podrían estar relacionados con {recommended_specialty}, pero se recomienda evaluación"

    return recommended_specialty, confidence, explanation

@ai_router.post("/orient", response_model=OrientationResponse, status_code=status.HTTP_200_OK)
def get_orientation(request: OrientationRequest, db: Session = Depends(get_db)):
    specialty, confidence, explanation = analyze_symptoms(request.symptoms)

    new_query = OrientationQuery(
        user_id=request.user_id,
        symptoms=request.symptoms,
        recommended_specialty=specialty,
        confidence=confidence
    )

    db.add(new_query)
    db.commit()
    db.refresh(new_query)

    return OrientationResponse(
        id=new_query.id,
        symptoms=new_query.symptoms,
        recommended_specialty=new_query.recommended_specialty,
        confidence=new_query.confidence,
        explanation=explanation,
        created_at=new_query.created_at
    )
