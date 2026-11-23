from fastapi import APIRouter
from app.schemas.skill_schema import (
    SkillGapRequest, 
    SkillGapResponse, 
    JobMatchingRequest, 
    JobMatchingResponse
)
from app.services.skill_engine import SkillEngine

router = APIRouter(prefix="/api/v1/ai", tags=["AI Engine"])

@router.post("/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(request: SkillGapRequest):
    return SkillEngine.calculate_skill_gap(request)

@router.post("/job-matching", response_model=JobMatchingResponse)
def match_jobs(request: JobMatchingRequest):
    return SkillEngine.match_jobs_with_nlp(request)
