from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class CareerPredictionInput(BaseModel):
    # Skill mapping: skill_id 1 to 24 with proficiency level 0 to 5
    student_skills: Dict[int, int] = Field(
        default_factory=dict,
        description="Dictionary mapping skill_id (1-24) to student proficiency level (0-5)"
    )
    cgpa: float = Field(default=8.0, ge=0.0, le=10.0, description="Student cumulative GPA")
    academic_year: int = Field(default=3, ge=1, le=4, description="Current academic year (1-4)")
    projects_count: int = Field(default=2, ge=0, description="Number of completed portfolio projects")
    certifications_count: int = Field(default=1, ge=0, description="Number of verified certifications")

class CareerProbability(BaseModel):
    role: str
    probability: float
    percentage: float

class CareerPredictionResult(BaseModel):
    predicted_role: str
    confidence: float
    confidence_percentage: float
    top_recommendations: List[CareerProbability]
    model_version: str = "RandomForest-v1.0"
