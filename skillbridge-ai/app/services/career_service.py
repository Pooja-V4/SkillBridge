import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict
from app.schemas.career_schema import (
    CareerPredictionInput,
    CareerPredictionResult,
    CareerProbability
)

class CareerService:
    def __init__(self):
        self.artifacts_dir = os.path.join(os.path.dirname(__file__), "..", "artifacts")
        self.model_path = os.path.join(self.artifacts_dir, "career_rf_model.joblib")
        self.metadata_path = os.path.join(self.artifacts_dir, "career_model_metadata.json")
        self.model = None
        self.feature_names = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, "r") as f:
                    meta = json.load(f)
                    self.feature_names = meta.get("feature_names", [])
            print(f"[CareerService] Loaded Random Forest model with classes: {self.model.classes_}")
        else:
            print(f"[CareerService] WARNING: Model artifact not found at {self.model_path}")

    def predict_career(self, payload: CareerPredictionInput) -> CareerPredictionResult:
        if self.model is None:
            self._load_model()
            if self.model is None:
                raise RuntimeError("Career prediction model is not trained or available.")

        # Construct feature vector corresponding to exact training columns
        # ['skill_1'..'skill_24', 'cgpa', 'academic_year', 'projects_count', 'certifications_count']
        feature_vector = []
        for i in range(1, 25):
            feature_vector.append(payload.student_skills.get(i, 0))

        feature_vector.append(payload.cgpa)
        feature_vector.append(payload.academic_year)
        feature_vector.append(payload.projects_count)
        feature_vector.append(payload.certifications_count)

        feature_df = pd.DataFrame([feature_vector], columns=self.feature_names)

        # Predict probabilities
        probabilities = self.model.predict_proba(feature_df)[0]
        classes = self.model.classes_

        # Rank all predictions
        role_probs = [
            CareerProbability(
                role=cls_name,
                probability=round(float(prob), 4),
                percentage=round(float(prob) * 100, 2)
            )
            for cls_name, prob in zip(classes, probabilities)
        ]
        # Sort descending by probability
        role_probs.sort(key=lambda x: x.probability, reverse=True)

        top_choice = role_probs[0]

        return CareerPredictionResult(
            predicted_role=top_choice.role,
            confidence=top_choice.probability,
            confidence_percentage=top_choice.percentage,
            top_recommendations=role_probs[:5],
            model_version="RandomForest-v1.0"
        )

career_service = CareerService()
