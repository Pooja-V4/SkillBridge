package com.skillbridge.service;

import com.skillbridge.dto.skill.SkillResponse;
import com.skillbridge.entity.Skill;
import com.skillbridge.enums.SkillCategory;
import com.skillbridge.repository.SkillRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialSkills() {
        if (skillRepository.count() == 0) {
            List<Skill> standardSkills = Arrays.asList(
                    // Programming Languages
                    Skill.builder().name("Java").category(SkillCategory.PROGRAMMING_LANGUAGE).description("Core Java, OOP, Collections, Multithreading").build(),
                    Skill.builder().name("Python").category(SkillCategory.PROGRAMMING_LANGUAGE).description("Python 3, Data Structures, Scripting, AI/ML").build(),
                    Skill.builder().name("JavaScript").category(SkillCategory.PROGRAMMING_LANGUAGE).description("ES6+, Modern Asynchronous JavaScript").build(),
                    Skill.builder().name("TypeScript").category(SkillCategory.PROGRAMMING_LANGUAGE).description("Typed JavaScript, Interfaces, Generics").build(),
                    Skill.builder().name("C++").category(SkillCategory.PROGRAMMING_LANGUAGE).description("Systems programming, STL, Low-level computing").build(),

                    // Frontend
                    Skill.builder().name("React").category(SkillCategory.FRONTEND).description("React 18/19, Hooks, Context, Virtual DOM").build(),
                    Skill.builder().name("HTML5 & CSS3").category(SkillCategory.FRONTEND).description("Semantic markup, Responsive Grid & Flexbox").build(),
                    Skill.builder().name("Tailwind CSS").category(SkillCategory.FRONTEND).description("Utility-first modern CSS framework").build(),
                    Skill.builder().name("Angular").category(SkillCategory.FRONTEND).description("TypeScript-based web application framework").build(),

                    // Backend
                    Skill.builder().name("Spring Boot").category(SkillCategory.BACKEND).description("Spring Boot 3, REST API, Spring Data, Security").build(),
                    Skill.builder().name("Node.js & Express").category(SkillCategory.BACKEND).description("Server-side JavaScript runtime and APIs").build(),
                    Skill.builder().name("RESTful APIs").category(SkillCategory.BACKEND).description("API architecture, HTTP verbs, JSON, status codes").build(),
                    Skill.builder().name("Microservices").category(SkillCategory.BACKEND).description("Distributed systems architecture and communication").build(),

                    // Database
                    Skill.builder().name("PostgreSQL").category(SkillCategory.DATABASE).description("Relational database design, SQL queries, indexing").build(),
                    Skill.builder().name("MySQL").category(SkillCategory.DATABASE).description("Relational database management and optimization").build(),
                    Skill.builder().name("MongoDB").category(SkillCategory.DATABASE).description("NoSQL document store, BSON, aggregation pipelines").build(),

                    // DevOps & Cloud
                    Skill.builder().name("Git & GitHub").category(SkillCategory.DEVOPS_CLOUD).description("Version control, branching, PRs, CI/CD basics").build(),
                    Skill.builder().name("Docker").category(SkillCategory.DEVOPS_CLOUD).description("Containerization, Dockerfile, Docker Compose").build(),
                    Skill.builder().name("AWS (Amazon Web Services)").category(SkillCategory.DEVOPS_CLOUD).description("EC2, S3, RDS, Cloud fundamentals").build(),

                    // AI & Data
                    Skill.builder().name("Machine Learning").category(SkillCategory.DATA_AI).description("Supervised, Unsupervised learning, Scikit-learn").build(),
                    Skill.builder().name("Pandas & NumPy").category(SkillCategory.DATA_AI).description("Data wrangling, numerical matrix computations").build(),
                    Skill.builder().name("Natural Language Processing (NLP)").category(SkillCategory.DATA_AI).description("Text preprocessing, TF-IDF, embeddings").build(),

                    // Soft Skills
                    Skill.builder().name("Problem Solving & DSA").category(SkillCategory.SOFT_SKILL).description("Algorithmic problem solving and complexity").build(),
                    Skill.builder().name("Teamwork & Collaboration").category(SkillCategory.SOFT_SKILL).description("Agile, effective communication in team settings").build(),
                    Skill.builder().name("Technical Communication").category(SkillCategory.SOFT_SKILL).description("Verbal and written technical reporting").build()
            );

            skillRepository.saveAll(standardSkills);
        }
    }

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SkillResponse> getSkillsByCategory(SkillCategory category) {
        return skillRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SkillResponse mapToResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .description(skill.getDescription())
                .build();
    }
}
