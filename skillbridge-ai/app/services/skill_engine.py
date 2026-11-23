from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.schemas.skill_schema import (
    SkillGapRequest, 
    SkillGapResponse, 
    SkillEvaluation,
    JobMatchingRequest,
    JobMatchingResponse,
    RankedJobMatch
)

class SkillEngine:

    @staticmethod
    def calculate_skill_gap(request: SkillGapRequest) -> SkillGapResponse:
        student_skill_map: Dict[int, int] = {
            s.skill_id: s.proficiency_level for s in request.student_skills
        }

        weighted_earned = 0.0
        weighted_total = 0.0
        evaluations: List[SkillEvaluation] = []

        matched_count = 0
        partial_count = 0
        missing_count = 0

        for req in request.job_requirements:
            stud_lvl = student_skill_map.get(req.skill_id, 0)
            req_lvl = req.min_proficiency_level
            gap = max(0, req_lvl - stud_lvl)

            # Accumulate weighted match
            weighted_earned += req.weight * min(stud_lvl, req_lvl)
            weighted_total += req.weight * req_lvl

            # Determine category
            if stud_lvl >= req_lvl:
                status = "MATCHED"
                priority = "LOW"
                matched_count += 1
            elif stud_lvl > 0:
                status = "PARTIAL"
                priority = "HIGH" if req.is_mandatory else "MEDIUM"
                partial_count += 1
            else:
                status = "MISSING"
                priority = "HIGH" if req.is_mandatory else "MEDIUM"
                missing_count += 1

            evaluations.append(SkillEvaluation(
                skill_id=req.skill_id,
                skill_name=req.skill_name,
                required_level=req_lvl,
                student_level=stud_lvl,
                gap=gap,
                weight=req.weight,
                is_mandatory=req.is_mandatory,
                status=status,
                priority=priority
            ))

        match_pct = 100.0 if weighted_total == 0 else round((weighted_earned / weighted_total) * 100.0, 1)

        summary = (
            f"You match {match_pct}% of the required competencies for {request.target_role}. "
            f"You have {matched_count} fully matched, {partial_count} partial, and {missing_count} missing skills."
        )

        return SkillGapResponse(
            target_role=request.target_role,
            overall_match_percentage=match_pct,
            total_required_skills=len(request.job_requirements),
            matched_skills_count=matched_count,
            partial_skills_count=partial_count,
            missing_skills_count=missing_count,
            evaluations=evaluations,
            summary_message=summary
        )

    @staticmethod
    def match_jobs_with_nlp(request: JobMatchingRequest) -> JobMatchingResponse:
        if not request.available_jobs:
            return JobMatchingResponse(total_evaluated=0, recommendations=[])

        student_skill_text = " ".join([s.skill_name for s in request.student_skills])
        student_corpus = f"{request.student_bio} {student_skill_text}".strip()

        job_texts = []
        for job in request.available_jobs:
            req_text = " ".join([r.skill_name for r in job.requirements])
            job_texts.append(f"{job.job_title} {job.job_description} {req_text}")

        # TF-IDF Vectorization & Cosine Similarity
        corpus = [student_corpus] + job_texts
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(corpus)

        cosine_sims = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        ranked: List[RankedJobMatch] = []
        student_map = {s.skill_id: s.proficiency_level for s in request.student_skills}

        for idx, job in enumerate(request.available_jobs):
            cos_score = round(float(cosine_sims[idx]), 3)

            # Calculate weighted match
            earned = 0.0
            total = 0.0
            missing_core = []

            for r in job.requirements:
                lvl = student_map.get(r.skill_id, 0)
                earned += r.weight * min(lvl, r.min_proficiency_level)
                total += r.weight * r.min_proficiency_level
                if lvl == 0 and r.is_mandatory:
                    missing_core.append(r.skill_name)

            weighted_pct = 100.0 if total == 0 else round((earned / total) * 100.0, 1)

            # Combined score: 60% weighted rule-based match + 40% TF-IDF contextual similarity
            combined_score = round((0.6 * weighted_pct) + (0.4 * cos_score * 100.0), 1)

            ranked.append(RankedJobMatch(
                job_id=job.job_id,
                job_title=job.job_title,
                company_name=job.company_name,
                tfidf_similarity_score=cos_score,
                weighted_skill_match_percentage=weighted_pct,
                combined_recommendation_score=combined_score,
                missing_core_skills=missing_core
            ))

        ranked.sort(key=lambda x: x.combined_recommendation_score, reverse=True)

        return JobMatchingResponse(
            total_evaluated=len(ranked),
            recommendations=ranked
        )
