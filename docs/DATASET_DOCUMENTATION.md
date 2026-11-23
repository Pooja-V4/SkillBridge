# SkillBridge Dataset Documentation & Data Dictionary

This document details the datasets created for **SkillBridge: An AI-Driven Academia–Industry Collaboration Platform**. These datasets provide ground truth for career track prediction (Random Forest), job matching (TF-IDF & Cosine Similarity), student clustering (K-Means), and personalized learning roadmap generation.

---

## 1. Datasets Overview

| Filename | Records | Purpose / Target Algorithm |
|---|---|---|
| `students.csv` | 300 | Student profiles, academic performance (CGPA), department, academic year. |
| `student_skills.csv` | 2,889 | Granular skills per student with proficiency level (1–5) and experience. |
| `career_labels.csv` | 300 | Feature-engineered dataset (24 skill proficiencies + CGPA + projects + certifications) mapped to target career category for **Random Forest Classifier**. |
| `job_roles.csv` | 8 | Standardized career categories (e.g. *Java Developer*, *Full Stack Developer*, *Data Analyst*). |
| `job_requirements.csv` | 68 | Weighted skill requirement matrix (proficiency 1–5, weights 1.0–2.0) per job role. |
| `internship_data.csv` | 30 | Realistic industry internship postings with stipends, duration, and eligibility criteria. |
| `learning_resources.csv` | 18 | Curated, verified tutorials and courses from official documentation and platforms (Spring Guides, MDN, React Docs, freeCodeCamp, Kaggle). |

---

## 2. Data Dictionary

### A. `students.csv`
- `id` (Integer): Unique student identifier.
- `roll_number` (String): Institutional roll/matriculation code.
- `first_name` (String): Student first name.
- `last_name` (String): Student last name.
- `email` (String): Institutional email address.
- `department` (String): Academic program (CSE, IT, AI & Data Science, ECE).
- `academic_year` (Integer): 2, 3, or 4.
- `graduation_year` (Integer): Estimated year of graduation (2025–2027).
- `cgpa` (Float, 0.0–10.0): Cumulative Grade Point Average ($N \sim (8.1, 0.7)$).
- `target_career_role` (String): Self-selected target engineering path.
- `projects_count` (Integer): Number of portfolio projects completed.
- `certifications_count` (Integer): Number of verified credentials earned.

### B. `student_skills.csv`
- `id` (Integer): Unique skill assignment ID.
- `student_id` (Integer): Foreign key referencing `students.csv`.
- `skill_id` (Integer): Standardized skill identifier (1 to 24).
- `skill_name` (String): Standardized skill name (Java, React, Spring Boot, etc.).
- `proficiency_level` (Integer, 1–5): 
  - `1 = Beginner`
  - `2 = Basic`
  - `3 = Intermediate`
  - `4 = Advanced`
  - `5 = Expert`
- `experience_months` (Integer): Practical duration working with the skill.

### C. `career_labels.csv` (Machine Learning Training Matrix)
- `skill_1` to `skill_24` (Integers, 0–5): Proficiency ratings in each of the 24 standard taxonomy skills.
- `cgpa` (Float): Student CGPA.
- `academic_year` (Integer): Current year of study.
- `projects_count` (Integer): Applied project count.
- `certifications_count` (Integer): Number of verified certifications.
- `career_role` (Categorical Target Label):
  - `Java Developer`
  - `Full Stack Developer`
  - `Frontend Developer`
  - `Backend Developer`
  - `Python Developer`
  - `Data Analyst`
  - `Machine Learning Engineer`
  - `DevOps Engineer`

### D. `job_requirements.csv`
- `id` (Integer): Unique requirement ID.
- `job_role_id` (Integer): Standard role ID.
- `role_title` (String): Career role name.
- `skill_id` (Integer): Required skill ID.
- `skill_name` (String): Required skill name.
- `min_proficiency_level` (Integer, 1–5): Minimum acceptable competency level.
- `weight` (Float, 1.0–2.0): 
  - `1.0 = Supporting/Secondary Competency`
  - `2.0 = Core/Essential Competency`
- `is_mandatory` (Boolean): Flag indicating non-negotiable prerequisite.

### E. `internship_data.csv`
- `id` (Integer): Unique internship posting ID.
- `title` (String): Internship designation.
- `company_name` (String): Corporate partner organization.
- `category` (String): Industry sector.
- `location` (String): City / Remote / Hybrid.
- `duration_months` (Integer): 3 or 6 months.
- `stipend_monthly` (Float): ₹15,000 to ₹50,000 / month.
- `min_cgpa` (Float): Cutoff CGPA (6.5 to 8.0).
- `description` (Text): Scope of work and engineering tasks.

### F. `learning_resources.csv`
- `id` (Integer): Unique resource ID.
- `title` (String): Resource / Course name.
- `skill_name` (String): Target skill addressed.
- `skill_id` (Integer): Standard skill ID.
- `platform` (String): Provider (Spring Guides, MDN Web Docs, React.dev, Coursera, Kaggle, etc.).
- `url` (String): Verified, non-hallucinated documentation or platform URL.
- `difficulty` (String): `BEGINNER`, `INTERMEDIATE`, `ADVANCED`.
- `duration` (String): Estimated hours to complete.
