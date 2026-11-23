from fastapi import APIRouter, HTTPException
from app.schemas.career_schema import CareerPredictionInput, CareerPredictionResult
from app.services.career_service import career_service

router = APIRouter(prefix="/api/v1/ai", tags=["Career Prediction Engine"])

@router.post("/career-prediction", response_model=CareerPredictionResult)
def predict_career(payload: CareerPredictionInput):
    """
    Evaluates student competencies, CGPA, projects, and certifications 
    against a trained Random Forest model to predict best-fit career trajectory.
    """
    try:
        return career_service.predict_career(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
