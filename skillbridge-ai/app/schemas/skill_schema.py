from pydantic import BaseModel, Field
from typing import List, Optional

class SkillItem(BaseModel):
    skill_id: int
    skill_name: str
    proficiency_level: int = Field(ge=1, le=5)

class RequirementItem(BaseModel):
    skill_id: int
    skill_name: str
    min_proficiency_level: int = Field(ge=1, le=5)
    weight: float = 1.0
    is_mandatory: bool = True

class SkillGapRequest(BaseModel):
    target_role: str
    student_skills: List[SkillItem]
    job_requirements: List[RequirementItem]

class SkillEvaluation(BaseModel):
    skill_id: int
    skill_name: str
    required_level: int
    student_level: int
    gap: int
    weight: float
    is_mandatory: bool
    status: str  # MATCHED, PARTIAL, MISSING
    priority: str  # HIGH, MEDIUM, LOW

class SkillGapResponse(BaseModel):
    target_role: str
    overall_match_percentage: float
    total_required_skills: int
    matched_skills_count: int
    partial_skills_count: int
    missing_skills_count: int
    evaluations: List[SkillEvaluation]
    summary_message: str

class JobMatchCandidate(BaseModel):
    job_id: int
    job_title: str
    company_name: str
    job_description: str
    requirements: List[RequirementItem]

class JobMatchingRequest(BaseModel):
    student_bio: Optional[str] = ""
    student_skills: List[SkillItem]
    available_jobs: List[JobMatchCandidate]

class RankedJobMatch(BaseModel):
    job_id: int
    job_title: str
    company_name: str
    tfidf_similarity_score: float
    weighted_skill_match_percentage: float
    combined_recommendation_score: float
    missing_core_skills: List[str]

class JobMatchingResponse(BaseModel):
    total_evaluated: int
    recommendations: List[RankedJobMatch]
