import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

def train_career_model():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets", "career_labels.csv")
    artifacts_dir = os.path.join(os.path.dirname(__file__), "..", "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    print(f"Loading career dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    feature_cols = [c for c in df.columns if c != 'career_role']
    target_col = 'career_role'

    X = df[feature_cols]
    y = df[target_col]

    print(f"Dataset Shape: {X.shape[0]} samples, {X.shape[1]} features")
    print(f"Target classes ({len(y.unique())}): {list(y.unique())}")

    # Stratified Train/Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Instantiate Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=3,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )

    # 5-Fold Cross Validation
    cv_scores = cross_val_score(rf, X_train, y_train, cv=5, scoring='accuracy')
    print(f"5-Fold CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

    # Fit on training set
    rf.fit(X_train, y_train)

    # Evaluation on holdout test set
    y_pred = rf.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    print(f"\nHoldout Test Accuracy: {test_acc:.4f} ({test_acc*100:.2f}%)")

    report = classification_report(y_test, y_pred, output_dict=True)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Feature Importance
    importances = rf.feature_importances_
    feature_importance_list = [
        {"feature": f, "importance": float(imp)}
        for f, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    ]

    # Save artifacts
    model_artifact_path = os.path.join(artifacts_dir, "career_rf_model.joblib")
    joblib.dump(rf, model_artifact_path)
    print(f"\nModel saved to: {model_artifact_path}")

    metadata = {
        "model_type": "RandomForestClassifier",
        "n_estimators": 150,
        "max_depth": 12,
        "cv_accuracy_mean": float(cv_scores.mean()),
        "cv_accuracy_std": float(cv_scores.std()),
        "test_accuracy": float(test_acc),
        "classes": list(rf.classes_),
        "feature_names": feature_cols,
        "feature_importances": feature_importance_list[:10],
        "classification_metrics": report
    }

    metadata_path = os.path.join(artifacts_dir, "career_model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata and metrics saved to: {metadata_path}")

if __name__ == "__main__":
    train_career_model()
