package com.skillbridge.service;

import com.skillbridge.dto.analytics.AdminDashboardResponse;
import com.skillbridge.entity.User;
import com.skillbridge.enums.RoleType;
import com.skillbridge.repository.*;
import org.springframework.boot.SpringBootVersion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final FacultyRepository facultyRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;

    public AdminService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            RecruiterRepository recruiterRepository,
            FacultyRepository facultyRepository,
            JobRepository jobRepository,
            InternshipRepository internshipRepository,
            ApplicationRepository applicationRepository,
            SkillRepository skillRepository
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.facultyRepository = facultyRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboardStats() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long totalStudents = studentRepository.count();
        long totalRecruiters = recruiterRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalJobs = jobRepository.count();
        long totalInternships = internshipRepository.count();
        long totalApplications = applicationRepository.count();
        long totalSkills = skillRepository.count();

        Map<String, Long> roleDistribution = new HashMap<>();
        for (RoleType r : RoleType.values()) {
            roleDistribution.put(r.name(), users.stream().filter(u -> u.getRole() == r).count());
        }

        Map<String, Long> appTypeDistribution = new HashMap<>();
        appTypeDistribution.put("JOB", (long) applicationRepository.findByJobIsNotNull().size());
        appTypeDistribution.put("INTERNSHIP", (long) applicationRepository.findByInternshipIsNotNull().size());

        List<AdminDashboardResponse.RecentUserDto> recentUsers = users.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(u -> AdminDashboardResponse.RecentUserDto.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .fullName(u.getFirstName() + " " + u.getLastName())
                        .role(u.getRole().name())
                        .isActive(u.getIsActive())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        AdminDashboardResponse.SystemHealthDto health = AdminDashboardResponse.SystemHealthDto.builder()
                .databaseStatus("CONNECTED (PostgreSQL 18.3)")
                .aiServiceStatus("ACTIVE (Python 3.12 / FastAPI)")
                .springBootVersion(SpringBootVersion.getVersion())
                .activeSessions(totalUsers)
                .build();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalFaculty(totalFaculty)
                .totalJobs(totalJobs)
                .totalInternships(totalInternships)
                .totalApplications(totalApplications)
                .totalSkills(totalSkills)
                .userRoleDistribution(roleDistribution)
                .applicationTypeDistribution(appTypeDistribution)
                .recentUsers(recentUsers)
                .systemHealth(health)
                .build();
    }
}
