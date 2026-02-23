from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from models import OrientationQuery
from schemas import OrientationRequest, OrientationResponse
import re
import os
import json
import requests
from dotenv import load_dotenv

# load environment variables (GROQ_API_KEY, etc.)
load_dotenv()

ai_router = APIRouter()

SPECIALTIES = {
    'Cardiología': 'Enfermedades del corazón y sistema circulatorio',
    'Pediatría': 'Atención médica de bebés y niños',
    'Dermatología': 'Trastornos de la piel, cabello y uñas',
    'Psicología': 'Salud mental y emocional',
    'Traumatología': 'Lesiones musculoesqueléticas y óseas',
    'Ginecología': 'Salud reproductiva femenina',
    'Oftalmología': 'Problemas de la vista y los ojos',
    'Neurología': 'Enfermedades del sistema nervioso',
    'Nutrición': 'Consejos dietéticos y trastornos alimentarios',
    'Medicina General': 'Atención primaria para síntomas inespecíficos'
}

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


# helper to call the Groq inference API and ask llama model to classify
def classify_with_groq(symptoms: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in the environment")

    # endpoint may be configurable
    url = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")

    # instruct the model to return a JSON object containing specialty and a short comment
    system_msg = (
        "You are a helpful doctor assistant that must choose the most appropriate medical specialty "
        "from a fixed list based on patient symptoms or requirements. Output a JSON object with two keys: "
        "`specialty` (one of the listed specialties, or 'undefined') and `comment` (a brief rationale, "
        "no more than fifty words)."
    )
    # build a multi‑line description list for the prompt
    specialties_desc = "\n".join(f"- {name}: {desc}" for name, desc in SPECIALTIES.items())
    user_msg = (
        f"Specialties (name + description):\n{specialties_desc}\n\n"
        f"Symptoms: {symptoms}\n"
        "Respond with a valid JSON object as described above."
    )

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.0,
        "max_completion_tokens": 60,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    resp = requests.post(url, headers=headers, json=payload)
    
    resp.raise_for_status()
    data = resp.json()
    ### print('data', data)

    # chat response uses choices[0].message.content
    msg = data.get("choices", [{}])[0].get("message", {})
    return msg.strip()


def analyze_symptoms(symptoms: str) -> tuple:
    # First attempt classification via the external Groq model.
    ai_comment = ""
    try:
        raw = classify_with_groq(symptoms)
    except Exception:
        raw = None

    if raw:
        # try to interpret the model output as JSON
        try:
            cls = json.loads(raw)
        except ValueError:
            cls = {"specialty": raw}
        if not isinstance(cls, dict):
            cls = {"specialty": str(cls)}

        specialty = cls.get("specialty", "").strip()
        ai_comment = cls.get("comment", "").strip()

        if specialty.lower() == "undefined" or specialty not in SPECIALTIES:
            # treat as no clear match
            return (
                "Medicina General",
                "media",
                "No se encontraron síntomas específicos, se recomienda consulta general",
                "ai",
                ai_comment,
            )
        # valid specialty returned by model
        return (
            specialty,
            "media",  # generic medium confidence when using the model
            f"El modelo de IA sugiere {specialty} basado en los síntomas proporcionados",
            "ai",
            ai_comment,
        )

    # fallback to keyword scoring if the API call failed or returned nothing
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
        return "Medicina General", "media", "No se encontraron síntomas específicos, se recomienda consulta general", "logic", ""

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

    return recommended_specialty, confidence, explanation, "logic", ""

@ai_router.post("/orient", response_model=OrientationResponse, status_code=status.HTTP_200_OK)
def get_orientation(request: OrientationRequest, db: Session = Depends(get_db)):
    specialty, confidence, explanation, inference_method, comment = analyze_symptoms(request.symptoms)

    new_query = OrientationQuery(
        user_id=request.user_id,
        symptoms=request.symptoms,
        recommended_specialty=specialty,
        confidence=confidence,
        inference_method=inference_method,
        comment=comment,
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
        comment=new_query.comment,
        inference_method=new_query.inference_method,
        created_at=new_query.created_at
    )
