"""
SkillBridge Dataset Generator
Generates realistic, normalized, research-grade synthetic CSE/IT datasets for SkillBridge:
1. students.csv
2. student_skills.csv
3. job_roles.csv
4. job_requirements.csv
5. internship_data.csv
6. learning_resources.csv
7. career_labels.csv (Feature-engineered ground truth for Random Forest classifier)
"""

import os
import random
import numpy as np
import pandas as pd

# Set deterministic seed for reproducibility
random.seed(42)
np.random.seed(42)

DATASET_DIR = r"D:\SkillBridge\datasets"
os.makedirs(DATASET_DIR, exist_ok=True)

# 1. Standard Career Roles
CAREER_ROLES = [
    {"id": 1, "title": "Java Developer", "category": "Software Engineering"},
    {"id": 2, "title": "Full Stack Developer", "category": "Software Engineering"},
    {"id": 3, "title": "Frontend Developer", "category": "Web Development"},
    {"id": 4, "title": "Backend Developer", "category": "Backend Engineering"},
    {"id": 5, "title": "Python Developer", "category": "Software Engineering"},
    {"id": 6, "title": "Data Analyst", "category": "Data & AI"},
    {"id": 7, "title": "Machine Learning Engineer", "category": "Data & AI"},
    {"id": 8, "title": "DevOps Engineer", "category": "Cloud & Infrastructure"}
]

# 2. Standard Taxonomy of 24 Skills
SKILLS = [
    {"id": 1, "name": "Java", "category": "PROGRAMMING_LANGUAGE"},
    {"id": 2, "name": "Python", "category": "PROGRAMMING_LANGUAGE"},
    {"id": 3, "name": "JavaScript", "category": "PROGRAMMING_LANGUAGE"},
    {"id": 4, "name": "TypeScript", "category": "PROGRAMMING_LANGUAGE"},
    {"id": 5, "name": "C++", "category": "PROGRAMMING_LANGUAGE"},
    {"id": 6, "name": "React", "category": "FRONTEND"},
    {"id": 7, "name": "HTML5 & CSS3", "category": "FRONTEND"},
    {"id": 8, "name": "Tailwind CSS", "category": "FRONTEND"},
    {"id": 9, "name": "Angular", "category": "FRONTEND"},
    {"id": 10, "name": "Spring Boot", "category": "BACKEND"},
    {"id": 11, "name": "Node.js & Express", "category": "BACKEND"},
    {"id": 12, "name": "RESTful APIs", "category": "BACKEND"},
    {"id": 13, "name": "Microservices", "category": "BACKEND"},
    {"id": 14, "name": "PostgreSQL", "category": "DATABASE"},
    {"id": 15, "name": "MySQL", "category": "DATABASE"},
    {"id": 16, "name": "MongoDB", "category": "DATABASE"},
    {"id": 17, "name": "Git & GitHub", "category": "DEVOPS_CLOUD"},
    {"id": 18, "name": "Docker", "category": "DEVOPS_CLOUD"},
    {"id": 19, "name": "AWS (Amazon Web Services)", "category": "DEVOPS_CLOUD"},
    {"id": 20, "name": "Machine Learning", "category": "DATA_AI"},
    {"id": 21, "name": "Pandas & NumPy", "category": "DATA_AI"},
    {"id": 22, "name": "Natural Language Processing (NLP)", "category": "DATA_AI"},
    {"id": 23, "name": "Problem Solving & DSA", "category": "SOFT_SKILL"},
    {"id": 24, "name": "Teamwork & Collaboration", "category": "SOFT_SKILL"}
]

SKILL_NAME_TO_ID = {s["name"]: s["id"] for s in SKILLS}

# Role-specific core competencies (used for realistic student profiling and job requirements)
ROLE_SKILL_PROFILES = {
    "Java Developer": {
        "core": ["Java", "Spring Boot", "RESTful APIs", "PostgreSQL", "Git & GitHub", "Problem Solving & DSA"],
        "secondary": ["Docker", "Microservices", "MySQL", "HTML5 & CSS3"]
    },
    "Full Stack Developer": {
        "core": ["React", "JavaScript", "Spring Boot", "HTML5 & CSS3", "PostgreSQL", "Git & GitHub"],
        "secondary": ["TypeScript", "Tailwind CSS", "RESTful APIs", "Docker"]
    },
    "Frontend Developer": {
        "core": ["React", "JavaScript", "TypeScript", "HTML5 & CSS3", "Tailwind CSS", "Git & GitHub"],
        "secondary": ["Angular", "RESTful APIs", "Problem Solving & DSA"]
    },
    "Backend Developer": {
        "core": ["Java", "Spring Boot", "RESTful APIs", "PostgreSQL", "Docker", "Microservices"],
        "secondary": ["Node.js & Express", "Git & GitHub", "AWS (Amazon Web Services)"]
    },
    "Python Developer": {
        "core": ["Python", "RESTful APIs", "PostgreSQL", "Git & GitHub", "Problem Solving & DSA"],
        "secondary": ["Docker", "Pandas & NumPy", "Machine Learning"]
    },
    "Data Analyst": {
        "core": ["Python", "Pandas & NumPy", "PostgreSQL", "MySQL", "Problem Solving & DSA"],
        "secondary": ["Machine Learning", "Git & GitHub"]
    },
    "Machine Learning Engineer": {
        "core": ["Python", "Machine Learning", "Pandas & NumPy", "Natural Language Processing (NLP)", "Problem Solving & DSA"],
        "secondary": ["Docker", "Git & GitHub", "PostgreSQL"]
    },
    "DevOps Engineer": {
        "core": ["Docker", "AWS (Amazon Web Services)", "Git & GitHub", "Python", "Microservices"],
        "secondary": ["PostgreSQL", "RESTful APIs"]
    }
}

FIRST_NAMES = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
               "Ananya", "Diya", "Isha", "Riya", "Aadhya", "Pooja", "Sneha", "Kavya", "Tanvi", "Meera"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Gupta", "Deshmukh", "Choudhury",
              "Bose", "Mehta", "Singh", "Das", "Joshi", "Kulkarni", "Chatterjee", "Menon", "Agarwal", "Bhat"]
DEPARTMENTS = ["Computer Science & Engineering", "Information Technology", "AI & Data Science", "Electronics & Communication"]


def generate_students_and_skills(num_students=300):
    student_records = []
    skill_records = []
    career_label_records = []

    student_skill_id = 1

    for s_id in range(1, num_students + 1):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        dept = random.choice(DEPARTMENTS)
        year = random.choice([2, 3, 4])
        grad_year = 2027 - (year - 1)
        cgpa = round(random.gauss(8.1, 0.7), 2)
        cgpa = max(6.0, min(9.9, cgpa))

        # Pick primary career affinity
        assigned_role = random.choice(list(ROLE_SKILL_PROFILES.keys()))
        profile_skills = ROLE_SKILL_PROFILES[assigned_role]

        roll_no = f"{grad_year % 100}{dept[:2].upper()}{100 + s_id}"
        email = f"{first.lower()}.{last.lower()}{s_id}@university.edu"

        student_records.append({
            "id": s_id,
            "roll_number": roll_no,
            "first_name": first,
            "last_name": last,
            "email": email,
            "department": dept,
            "academic_year": year,
            "graduation_year": grad_year,
            "cgpa": cgpa,
            "target_career_role": assigned_role,
            "projects_count": random.randint(1, 4),
            "certifications_count": random.randint(0, 3)
        })

        # Feature vector initialization for career_labels.csv (all 24 skill proficiencies)
        feature_vector = {f"skill_{sk['id']}": 0 for sk in SKILLS}

        # Core skills have higher proficiency (3 to 5)
        for s_name in profile_skills["core"]:
            sk_id = SKILL_NAME_TO_ID[s_name]
            prof = random.choices([3, 4, 5], weights=[0.3, 0.5, 0.2])[0]
            feature_vector[f"skill_{sk_id}"] = prof
            skill_records.append({
                "id": student_skill_id,
                "student_id": s_id,
                "skill_id": sk_id,
                "skill_name": s_name,
                "proficiency_level": prof,
                "experience_months": prof * random.randint(3, 6)
            })
            student_skill_id += 1

        # Secondary skills have intermediate proficiency (1 to 3)
        for s_name in random.sample(profile_skills["secondary"], k=min(3, len(profile_skills["secondary"]))):
            sk_id = SKILL_NAME_TO_ID[s_name]
            prof = random.choices([1, 2, 3], weights=[0.4, 0.4, 0.2])[0]
            feature_vector[f"skill_{sk_id}"] = prof
            skill_records.append({
                "id": student_skill_id,
                "student_id": s_id,
                "skill_id": sk_id,
                "skill_name": s_name,
                "proficiency_level": prof,
                "experience_months": prof * random.randint(2, 4)
            })
            student_skill_id += 1

        # Add 1-2 random soft skills
        soft_skills = ["Problem Solving & DSA", "Teamwork & Collaboration"]
        for s_name in soft_skills:
            if random.random() > 0.3:
                sk_id = SKILL_NAME_TO_ID[s_name]
                prof = random.randint(3, 5)
                feature_vector[f"skill_{sk_id}"] = prof
                skill_records.append({
                    "id": student_skill_id,
                    "student_id": s_id,
                    "skill_id": sk_id,
                    "skill_name": s_name,
                    "proficiency_level": prof,
                    "experience_months": 12
                })
                student_skill_id += 1

        # Save feature row with assigned label
        feature_vector["cgpa"] = cgpa
        feature_vector["academic_year"] = year
        feature_vector["projects_count"] = student_records[-1]["projects_count"]
        feature_vector["certifications_count"] = student_records[-1]["certifications_count"]
        feature_vector["career_role"] = assigned_role
        career_label_records.append(feature_vector)

    return (
        pd.DataFrame(student_records),
        pd.DataFrame(skill_records),
        pd.DataFrame(career_label_records)
    )


def generate_job_roles_and_requirements():
    df_roles = pd.DataFrame(CAREER_ROLES)
    requirements_records = []
    req_id = 1

    for role in CAREER_ROLES:
        title = role["title"]
        profile = ROLE_SKILL_PROFILES[title]

        # Core requirements (weight 1.5 - 2.0, min level 3-4)
        for s_name in profile["core"]:
            requirements_records.append({
                "id": req_id,
                "job_role_id": role["id"],
                "role_title": title,
                "skill_id": SKILL_NAME_TO_ID[s_name],
                "skill_name": s_name,
                "min_proficiency_level": random.choice([3, 4]),
                "weight": 2.0,
                "is_mandatory": True
            })
            req_id += 1

        # Secondary requirements (weight 1.0, min level 2)
        for s_name in profile["secondary"]:
            requirements_records.append({
                "id": req_id,
                "job_role_id": role["id"],
                "role_title": title,
                "skill_id": SKILL_NAME_TO_ID[s_name],
                "skill_name": s_name,
                "min_proficiency_level": 2,
                "weight": 1.0,
                "is_mandatory": False
            })
            req_id += 1

    return df_roles, pd.DataFrame(requirements_records)


def generate_internships(num_internships=30):
    companies = [
        "Google Cloud Partner", "Microsoft Azure Labs", "Amazon Development Centre",
        "Infosys Innovation Lab", "TCS Digital Research", "Wipro Cloud Practice",
        "Cognizant AI Labs", "Thoughtworks", "Zoho Corporation", "Freshworks"
    ]
    locations = ["Bengaluru, India", "Hyderabad, India", "Chennai, India", "Pune, India", "Remote"]

    internships = []
    for i in range(1, num_internships + 1):
        role_info = random.choice(CAREER_ROLES)
        comp = random.choice(companies)
        loc = random.choice(locations)
        duration = random.choice([3, 6])
        stipend = random.choice([15000, 20000, 25000, 35000, 50000])

        internships.append({
            "id": i,
            "title": f"{role_info['title']} Intern",
            "company_name": comp,
            "category": role_info["category"],
            "location": loc,
            "duration_months": duration,
            "stipend_monthly": stipend,
            "min_cgpa": random.choice([6.5, 7.0, 7.5, 8.0]),
            "description": f"Exciting {duration}-month internship at {comp} focusing on {role_info['title']} tasks and production systems."
        })

    return pd.DataFrame(internships)


def generate_learning_resources():
    resources = [
        # Java & Spring Boot
        {"title": "Spring Boot 3 Fundamentals & REST APIs", "skill_name": "Spring Boot", "platform": "Official Spring Guides", "url": "https://spring.io/guides", "difficulty": "BEGINNER", "duration": "10 hours"},
        {"title": "Mastering Spring Data JPA with PostgreSQL", "skill_name": "Spring Boot", "platform": "Baeldung", "url": "https://www.baeldung.com/spring-boot", "difficulty": "INTERMEDIATE", "duration": "14 hours"},
        {"title": "Spring Security 6 with JWT Authentication", "skill_name": "Spring Boot", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org", "difficulty": "ADVANCED", "duration": "18 hours"},
        {"title": "Java Programming Masterclass: Collections & Streams", "skill_name": "Java", "platform": "Oracle University", "url": "https://dev.java", "difficulty": "INTERMEDIATE", "duration": "25 hours"},

        # React & Frontend
        {"title": "React Official Documentation: Quick Start & Hooks", "skill_name": "React", "platform": "React Official Docs", "url": "https://react.dev", "difficulty": "BEGINNER", "duration": "12 hours"},
        {"title": "Modern TypeScript for React Developers", "skill_name": "TypeScript", "platform": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs", "difficulty": "INTERMEDIATE", "duration": "15 hours"},
        {"title": "Tailwind CSS from Scratch to Production", "skill_name": "Tailwind CSS", "platform": "Tailwind Labs", "url": "https://tailwindcss.com/docs", "difficulty": "BEGINNER", "duration": "8 hours"},
        {"title": "Modern Web Development with HTML5 & CSS3", "skill_name": "HTML5 & CSS3", "platform": "MDN Web Docs", "url": "https://developer.mozilla.org", "difficulty": "BEGINNER", "duration": "20 hours"},

        # Databases
        {"title": "PostgreSQL Tutorial for Developers: Relational Design & Indexes", "skill_name": "PostgreSQL", "platform": "PostgreSQL Tutorial", "url": "https://www.postgresqltutorial.com", "difficulty": "BEGINNER", "duration": "16 hours"},
        {"title": "Database Normalization (1NF to BCNF) and SQL Optimization", "skill_name": "PostgreSQL", "platform": "GeeksforGeeks", "url": "https://www.geeksforgeeks.org/dbms", "difficulty": "INTERMEDIATE", "duration": "12 hours"},

        # DevOps & Cloud
        {"title": "Docker Hands-On: Containers and Multi-Stage Builds", "skill_name": "Docker", "platform": "Docker Docs", "url": "https://docs.docker.com/get-started", "difficulty": "INTERMEDIATE", "duration": "10 hours"},
        {"title": "Git & GitHub Workflow for Engineering Teams", "skill_name": "Git & GitHub", "platform": "GitHub Skills", "url": "https://skills.github.com", "difficulty": "BEGINNER", "duration": "6 hours"},
        {"title": "AWS Certified Cloud Practitioner Essentials", "skill_name": "AWS (Amazon Web Services)", "platform": "AWS Skill Builder", "url": "https://explore.skillbuilder.aws", "difficulty": "BEGINNER", "duration": "14 hours"},

        # AI & Data
        {"title": "Machine Learning with Scikit-Learn: Classification & Regression", "skill_name": "Machine Learning", "platform": "Scikit-Learn Docs", "url": "https://scikit-learn.org/stable/tutorial", "difficulty": "INTERMEDIATE", "duration": "24 hours"},
        {"title": "Data Analysis with Python, Pandas and NumPy", "skill_name": "Pandas & NumPy", "platform": "Kaggle Learn", "url": "https://www.kaggle.com/learn", "difficulty": "BEGINNER", "duration": "12 hours"},
        {"title": "Applied Natural Language Processing: TF-IDF & Word Embeddings", "skill_name": "Natural Language Processing (NLP)", "platform": "Coursera", "url": "https://www.coursera.org", "difficulty": "ADVANCED", "duration": "30 hours"},

        # Soft Skills & DSA
        {"title": "Data Structures & Algorithms: Trees, Graphs & Dynamic Programming", "skill_name": "Problem Solving & DSA", "platform": "NeetCode", "url": "https://neetcode.io", "difficulty": "INTERMEDIATE", "duration": "40 hours"},
        {"title": "Engineering Teamwork & Agile Methodologies", "skill_name": "Teamwork & Collaboration", "platform": "Atlassian Agile Coach", "url": "https://www.atlassian.com/agile", "difficulty": "BEGINNER", "duration": "5 hours"}
    ]

    for idx, r in enumerate(resources, start=1):
        r["id"] = idx
        r["skill_id"] = SKILL_NAME_TO_ID.get(r["skill_name"], 1)

    return pd.DataFrame(resources)


def main():
    print("Generating SkillBridge Datasets in:", DATASET_DIR)

    # 1. Students & Skills
    df_students, df_student_skills, df_career_labels = generate_students_and_skills(num_students=300)
    df_students.to_csv(os.path.join(DATASET_DIR, "students.csv"), index=False)
    df_student_skills.to_csv(os.path.join(DATASET_DIR, "student_skills.csv"), index=False)
    df_career_labels.to_csv(os.path.join(DATASET_DIR, "career_labels.csv"), index=False)
    print(f"  ✓ students.csv: {len(df_students)} records")
    print(f"  ✓ student_skills.csv: {len(df_student_skills)} records")
    print(f"  ✓ career_labels.csv: {len(df_career_labels)} feature records")

    # 2. Roles & Requirements
    df_roles, df_requirements = generate_job_roles_and_requirements()
    df_roles.to_csv(os.path.join(DATASET_DIR, "job_roles.csv"), index=False)
    df_requirements.to_csv(os.path.join(DATASET_DIR, "job_requirements.csv"), index=False)
    print(f"  ✓ job_roles.csv: {len(df_roles)} records")
    print(f"  ✓ job_requirements.csv: {len(df_requirements)} records")

    # 3. Internships
    df_internships = generate_internships(num_internships=30)
    df_internships.to_csv(os.path.join(DATASET_DIR, "internship_data.csv"), index=False)
    print(f"  ✓ internship_data.csv: {len(df_internships)} records")

    # 4. Learning Resources
    df_learning = generate_learning_resources()
    df_learning.to_csv(os.path.join(DATASET_DIR, "learning_resources.csv"), index=False)
    print(f"  ✓ learning_resources.csv: {len(df_learning)} records")

    print("\nAll 6 core datasets generated successfully!")


if __name__ == "__main__":
    main()
