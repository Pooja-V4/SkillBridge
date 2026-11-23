package com.skillbridge.service;

import com.skillbridge.dto.roadmap.RoadmapResponse;
import com.skillbridge.entity.*;
import com.skillbridge.enums.DifficultyLevel;
import com.skillbridge.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final RoadmapItemRepository roadmapItemRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final JobRoleRepository jobRoleRepository;
    private final JobRepository jobRepository;
    private final JobSkillRequirementRepository jobSkillRequirementRepository;

    public RoadmapService(
            LearningRoadmapRepository roadmapRepository,
            RoadmapItemRepository roadmapItemRepository,
            LearningResourceRepository learningResourceRepository,
            StudentRepository studentRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            StudentSkillRepository studentSkillRepository,
            JobRoleRepository jobRoleRepository,
            JobRepository jobRepository,
            JobSkillRequirementRepository jobSkillRequirementRepository
    ) {
        this.roadmapRepository = roadmapRepository;
        this.roadmapItemRepository = roadmapItemRepository;
        this.learningResourceRepository = learningResourceRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.jobRepository = jobRepository;
        this.jobSkillRequirementRepository = jobSkillRequirementRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialLearningResources() {
        if (learningResourceRepository.count() == 0) {
            Map<String, Skill> skillMap = skillRepository.findAll().stream()
                    .collect(Collectors.toMap(Skill::getName, s -> s, (s1, s2) -> s1));

            List<LearningResource> resources = new ArrayList<>();

            addResourceIfSkillExists(resources, skillMap, "Spring Boot", "Spring Boot 3 Fundamentals & REST APIs", "Official Spring Guides", "https://spring.io/guides", DifficultyLevel.BEGINNER, "10 hours", "Comprehensive guide on building RESTful microservices with Spring Boot 3.");
            addResourceIfSkillExists(resources, skillMap, "Spring Boot", "Mastering Spring Data JPA with PostgreSQL", "Baeldung", "https://www.baeldung.com/spring-boot", DifficultyLevel.INTERMEDIATE, "14 hours", "Deep dive into Hibernate, entities, connection pools, and queries.");
            addResourceIfSkillExists(resources, skillMap, "Spring Boot", "Spring Security 6 with JWT Authentication", "freeCodeCamp", "https://www.freecodecamp.org", DifficultyLevel.ADVANCED, "18 hours", "Stateless authentication, security filter chains, and JWT token claims.");
            addResourceIfSkillExists(resources, skillMap, "Java", "Java Programming Masterclass: Collections & Streams", "Oracle University", "https://dev.java", DifficultyLevel.INTERMEDIATE, "25 hours", "Core OOP, Collections API, Lambda expressions, and Functional Interfaces.");
            addResourceIfSkillExists(resources, skillMap, "React", "React Official Documentation: Quick Start & Hooks", "React Official Docs", "https://react.dev", DifficultyLevel.BEGINNER, "12 hours", "Modern React 19 functional components, useState, useEffect, and custom hooks.");
            addResourceIfSkillExists(resources, skillMap, "TypeScript", "Modern TypeScript for React Developers", "TypeScript Handbook", "https://www.typescriptlang.org/docs", DifficultyLevel.INTERMEDIATE, "15 hours", "Strong typing, interfaces, generics, and strict TypeScript configurations.");
            addResourceIfSkillExists(resources, skillMap, "Tailwind CSS", "Tailwind CSS from Scratch to Production", "Tailwind Labs", "https://tailwindcss.com/docs", DifficultyLevel.BEGINNER, "8 hours", "Utility-first CSS styling, responsive breakpoints, and animations.");
            addResourceIfSkillExists(resources, skillMap, "HTML5 & CSS3", "Modern Web Development with HTML5 & CSS3", "MDN Web Docs", "https://developer.mozilla.org", DifficultyLevel.BEGINNER, "20 hours", "Semantic HTML, flexbox, CSS Grid, and responsive web accessibility.");
            addResourceIfSkillExists(resources, skillMap, "PostgreSQL", "PostgreSQL Tutorial for Developers: Relational Design & Indexes", "PostgreSQL Tutorial", "https://www.postgresqltutorial.com", DifficultyLevel.BEGINNER, "16 hours", "DDL/DML queries, foreign key constraints, B-Tree indexes, and transactions.");
            addResourceIfSkillExists(resources, skillMap, "Docker", "Docker Hands-On: Containers and Multi-Stage Builds", "Docker Docs", "https://docs.docker.com/get-started", DifficultyLevel.INTERMEDIATE, "10 hours", "Containerizing Spring Boot and React applications for production.");
            addResourceIfSkillExists(resources, skillMap, "Git & GitHub", "Git & GitHub Workflow for Engineering Teams", "GitHub Skills", "https://skills.github.com", DifficultyLevel.BEGINNER, "6 hours", "Branching, merge requests, rebase, and conflict resolution.");
            addResourceIfSkillExists(resources, skillMap, "AWS (Amazon Web Services)", "AWS Certified Cloud Practitioner Essentials", "AWS Skill Builder", "https://explore.skillbuilder.aws", DifficultyLevel.BEGINNER, "14 hours", "Core cloud concepts, EC2, S3, RDS, and cloud security architecture.");
            addResourceIfSkillExists(resources, skillMap, "Machine Learning", "Machine Learning with Scikit-Learn: Classification & Regression", "Scikit-Learn Docs", "https://scikit-learn.org/stable/tutorial", DifficultyLevel.INTERMEDIATE, "24 hours", "Supervised learning, Random Forest, decision trees, and model evaluation metrics.");
            addResourceIfSkillExists(resources, skillMap, "Pandas & NumPy", "Data Analysis with Python, Pandas and NumPy", "Kaggle Learn", "https://www.kaggle.com/learn", DifficultyLevel.BEGINNER, "12 hours", "Data manipulation, vectorized operations, data cleansing, and aggregations.");
            addResourceIfSkillExists(resources, skillMap, "Problem Solving & DSA", "Data Structures & Algorithms: Trees, Graphs & Dynamic Programming", "NeetCode", "https://neetcode.io", DifficultyLevel.INTERMEDIATE, "40 hours", "Essential coding interview algorithms and time-space complexity analysis.");
            addResourceIfSkillExists(resources, skillMap, "Teamwork & Collaboration", "Engineering Teamwork & Agile Methodologies", "Atlassian Agile Coach", "https://www.atlassian.com/agile", DifficultyLevel.BEGINNER, "5 hours", "Scrum, sprint planning, peer code reviews, and cross-functional communication.");

            if (!resources.isEmpty()) {
                learningResourceRepository.saveAll(resources);
            }
        }
    }

    private void addResourceIfSkillExists(List<LearningResource> list, Map<String, Skill> skillMap, String skillName, String title, String platform, String url, DifficultyLevel diff, String dur, String desc) {
        Skill skill = skillMap.get(skillName);
        if (skill != null) {
            list.add(LearningResource.builder()
                    .skill(skill)
                    .title(title)
                    .platform(platform)
                    .url(url)
                    .difficulty(diff)
                    .estimatedDuration(dur)
                    .description(desc)
                    .build());
        }
    }

    @Transactional(readOnly = true)
    public RoadmapResponse getStudentCurrentRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        Optional<LearningRoadmap> roadmapOpt = roadmapRepository.findFirstByStudentOrderByCreatedAtDesc(student);
        if (roadmapOpt.isEmpty()) {
            return generatePersonalizedRoadmap(email, student.getTargetCareerRole() != null ? student.getTargetCareerRole() : "Java Developer");
        }

        return mapToResponse(roadmapOpt.get());
    }

    @Transactional
    public RoadmapResponse generatePersonalizedRoadmap(String email, String targetRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        String chosenRole = (targetRole != null && !targetRole.isBlank()) ? targetRole : (student.getTargetCareerRole() != null ? student.getTargetCareerRole() : "Java Developer");

        // Identify student's current proficiency
        Map<Long, Integer> studentSkillMap = studentSkillRepository.findByStudent(student).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiencyLevel));

        // Find required skills for this role
        List<Long> deficitSkillIds = new ArrayList<>();
        Optional<JobRole> roleOpt = jobRoleRepository.findByTitleIgnoreCase(chosenRole);

        if (roleOpt.isPresent()) {
            List<Job> sampleJobs = jobRepository.findByIsActiveTrue();
            for (Job j : sampleJobs) {
                if (j.getJobRole() != null && j.getJobRole().getId().equals(roleOpt.get().getId())) {
                    for (JobSkillRequirement req : jobSkillRequirementRepository.findByJob(j)) {
                        int currentLevel = studentSkillMap.getOrDefault(req.getSkill().getId(), 0);
                        if (currentLevel < req.getMinProficiencyLevel()) {
                            deficitSkillIds.add(req.getSkill().getId());
                        }
                    }
                    break;
                }
            }
        }

        // If no deficit identified or job role has no specific requirements, populate foundation learning resources
        List<LearningResource> matchedResources;
        if (!deficitSkillIds.isEmpty()) {
            matchedResources = learningResourceRepository.findBySkillIdIn(deficitSkillIds);
        } else {
            matchedResources = learningResourceRepository.findAll().stream().limit(6).collect(Collectors.toList());
        }

        // If still empty, fetch top available resources
        if (matchedResources.isEmpty()) {
            matchedResources = learningResourceRepository.findAll();
        }

        // Create new roadmap entity
        LearningRoadmap roadmap = LearningRoadmap.builder()
                .student(student)
                .targetRole(chosenRole)
                .completionPercentage(0.0)
                .items(new ArrayList<>())
                .build();

        LearningRoadmap savedRoadmap = roadmapRepository.save(roadmap);

        List<RoadmapItem> items = new ArrayList<>();
        int seq = 1;
        for (LearningResource res : matchedResources) {
            RoadmapItem item = RoadmapItem.builder()
                    .roadmap(savedRoadmap)
                    .resource(res)
                    .sequenceOrder(seq++)
                    .isCompleted(false)
                    .build();
            items.add(item);
        }

        roadmapItemRepository.saveAll(items);
        savedRoadmap.setItems(items);

        return mapToResponse(savedRoadmap);
    }

    @Transactional
    public RoadmapResponse toggleMilestoneCompletion(String email, Long roadmapItemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        RoadmapItem item = roadmapItemRepository.findById(roadmapItemId)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap milestone not found: " + roadmapItemId));

        if (!item.getRoadmap().getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this roadmap");
        }

        item.setIsCompleted(!item.getIsCompleted());
        roadmapItemRepository.save(item);

        // Recalculate progress percentage
        LearningRoadmap roadmap = item.getRoadmap();
        List<RoadmapItem> allItems = roadmapItemRepository.findByRoadmapOrderBySequenceOrderAsc(roadmap);
        long completedCount = allItems.stream().filter(RoadmapItem::getIsCompleted).count();
        double pct = allItems.isEmpty() ? 100.0 : Math.round(((double) completedCount / allItems.size()) * 1000.0) / 10.0;
        roadmap.setCompletionPercentage(pct);
        roadmapRepository.save(roadmap);

        return mapToResponse(roadmap);
    }

    private RoadmapResponse mapToResponse(LearningRoadmap roadmap) {
        List<RoadmapItem> items = roadmapItemRepository.findByRoadmapOrderBySequenceOrderAsc(roadmap);
        long completed = items.stream().filter(RoadmapItem::getIsCompleted).count();

        List<RoadmapResponse.RoadmapItemDto> itemDtos = items.stream().map(i ->
                RoadmapResponse.RoadmapItemDto.builder()
                        .id(i.getId())
                        .resourceId(i.getResource().getId())
                        .skillName(i.getResource().getSkill().getName())
                        .resourceTitle(i.getResource().getTitle())
                        .platform(i.getResource().getPlatform())
                        .url(i.getResource().getUrl())
                        .difficulty(i.getResource().getDifficulty().name())
                        .estimatedDuration(i.getResource().getEstimatedDuration())
                        .sequenceOrder(i.getSequenceOrder())
                        .isCompleted(i.getIsCompleted())
                        .build()
        ).collect(Collectors.toList());

        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .targetRole(roadmap.getTargetRole())
                .completionPercentage(roadmap.getCompletionPercentage())
                .totalMilestones(items.size())
                .completedMilestones((int) completed)
                .createdAt(roadmap.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
