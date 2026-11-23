# SkillBridge — Database Architecture & ER Diagram

This document describes the relational database design implemented in PostgreSQL for **SkillBridge: An AI-Driven Academia–Industry Collaboration Platform**.

## Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "has profile"
    USERS ||--o| FACULTY : "has profile"
    USERS ||--o| RECRUITERS : "has profile"
    USERS ||--o{ NOTIFICATIONS : "receives"

    DEPARTMENTS ||--o{ STUDENTS : "enrolls"
    DEPARTMENTS ||--o{ FACULTY : "belongs to"

    COMPANIES ||--o{ RECRUITERS : "employs"
    COMPANIES ||--o{ JOBS : "posts"
    COMPANIES ||--o{ INTERNSHIPS : "offers"

    STUDENTS ||--o{ STUDENT_SKILLS : "has"
    SKILLS ||--o{ STUDENT_SKILLS : "evaluated in"
    STUDENTS ||--o{ PROJECTS : "develops"
    STUDENTS ||--o{ CERTIFICATIONS : "earns"
    STUDENTS ||--o{ APPLICATIONS : "submits"
    STUDENTS ||--o{ LEARNING_ROADMAPS : "guided by"

    JOB_ROLES ||--o{ JOBS : "categorizes"
    JOBS ||--o{ JOB_SKILL_REQUIREMENTS : "demands"
    SKILLS ||--o{ JOB_SKILL_REQUIREMENTS : "required by"
    JOBS ||--o{ APPLICATIONS : "receives"

    INTERNSHIPS ||--o{ INTERNSHIP_SKILL_REQUIREMENTS : "demands"
    SKILLS ||--o{ INTERNSHIP_SKILL_REQUIREMENTS : "required by"
    INTERNSHIPS ||--o{ APPLICATIONS : "receives"

    SKILLS ||--o{ LEARNING_RESOURCES : "addressed by"
    LEARNING_ROADMAPS ||--o{ ROADMAP_ITEMS : "contains"
    LEARNING_RESOURCES ||--o{ ROADMAP_ITEMS : "assigned in"

    USERS {
        bigint id PK
        string email UK
        string password
        string first_name
        string last_name
        string phone
        string role "STUDENT, FACULTY, RECRUITER, ADMIN"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    STUDENTS {
        bigint id PK
        bigint user_id FK, UK
        string roll_number UK
        bigint department_id FK
        int academic_year
        int graduation_year
        double cgpa
        string bio
        string target_career_role
    }

    SKILLS {
        bigint id PK
        string name UK
        string category "PROGRAMMING_LANGUAGE, FRONTEND, BACKEND, DATABASE, DEVOPS_CLOUD, DATA_AI, SOFT_SKILL"
        string description
    }

    STUDENT_SKILLS {
        bigint id PK
        bigint student_id FK
        bigint skill_id FK
        int proficiency_level "1=Beginner to 5=Expert"
        int experience_months
    }

    JOBS {
        bigint id PK
        bigint recruiter_id FK
        bigint company_id FK
        bigint job_role_id FK
        string title
        text description
        string location
        double min_cgpa
        boolean is_active
    }

    APPLICATIONS {
        bigint id PK
        bigint student_id FK
        string type "JOB, INTERNSHIP"
        bigint job_id FK
        bigint internship_id FK
        string status "APPLIED, UNDER_REVIEW, SHORTLISTED, SELECTED, REJECTED"
        double skill_match_percentage
        timestamp applied_at
    }
```

---

## Verified Tables in PostgreSQL 18.3 (`skillbridge_db`)

All 21 relational tables are created and indexed:

1. `users` — Unified authentication & account entity.
2. `departments` — Academic branches (CSE, IT, ECE, AI&DS, etc.).
3. `students` — Student profiles, CGPA, department, graduation year.
4. `faculty` — Department coordinators and placement officers.
5. `companies` — Partner companies and recruiters' organizations.
6. `recruiters` — Talent acquisition professionals associated with companies.
7. `skills` — Standardized skill taxonomy (Categories: Programming, Frontend, Backend, etc.).
8. `student_skills` — Student self-assessment & project-backed skills (1–5 scale).
9. `projects` — Portfolio projects linked to students.
10. `certifications` — Industry credentials (AWS, Oracle, HackerRank, etc.).
11. `job_roles` — Career categories (e.g. *Java Developer*, *Data Analyst*).
12. `jobs` — Full-time / part-time job postings.
13. `job_skill_requirements` — Weighted skill requirements for matching algorithms.
14. `internships` — Practical internship openings for students.
15. `internship_skill_requirements` — Weighted skill requirements for internships.
16. `applications` — Multi-status application pipeline with duplicate-prevention constraints.
17. `learning_resources` — Curated courses, docs, tutorials for skill gap closure.
18. `learning_roadmaps` — Personalized learning tracks for missing skills.
19. `roadmap_items` — Sequenced checklist items with completion status.
20. `notifications` — Role-based system notifications.
21. `audit_logs` — Administrative and security traceability logs.
