package com.skillbridge.service;

import com.skillbridge.dto.job.CreateJobRequest;
import com.skillbridge.dto.job.JobResponse;
import com.skillbridge.dto.job.JobSkillResponse;
import com.skillbridge.entity.*;
import com.skillbridge.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobRoleRepository jobRoleRepository;
    private final SkillRepository skillRepository;
    private final JobSkillRequirementRepository jobSkillRequirementRepository;
    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public JobService(
            JobRepository jobRepository,
            JobRoleRepository jobRoleRepository,
            SkillRepository skillRepository,
            JobSkillRequirementRepository jobSkillRequirementRepository,
            RecruiterRepository recruiterRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository
    ) {
        this.jobRepository = jobRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.skillRepository = skillRepository;
        this.jobSkillRequirementRepository = jobSkillRequirementRepository;
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialJobRoles() {
        if (jobRoleRepository.count() == 0) {
            List<JobRole> roles = Arrays.asList(
                    JobRole.builder().title("Java Developer").category("Software Engineering").description("Core Java, Spring Boot, REST APIs, Microservices, PostgreSQL").build(),
                    JobRole.builder().title("Full Stack Developer").category("Software Engineering").description("React, TypeScript, Spring Boot/Node, Database, DevOps basics").build(),
                    JobRole.builder().title("Frontend Developer").category("Web Development").description("React, Modern JavaScript, HTML5/CSS3, Tailwind CSS, UI/UX").build(),
                    JobRole.builder().title("Backend Developer").category("Backend Engineering").description("Spring Boot, PostgreSQL, Docker, Microservices, API Security").build(),
                    JobRole.builder().title("Python Developer").category("Software Engineering").description("Python 3, Django/FastAPI, Data Processing, Scripting").build(),
                    JobRole.builder().title("Data Analyst").category("Data & AI").description("Python, Pandas, NumPy, SQL, Data Visualization, Statistics").build(),
                    JobRole.builder().title("Machine Learning Engineer").category("Data & AI").description("Scikit-learn, Model Training, NLP, Python, Feature Engineering").build(),
                    JobRole.builder().title("DevOps Engineer").category("Infrastructure").description("Docker, CI/CD, Git, AWS, Container Orchestration").build()
            );
            jobRoleRepository.saveAll(roles);
        }
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllActiveJobs() {
        return jobRepository.findByIsActiveTrue().stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with id: " + id));
        return mapToJobResponse(job);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyPostedJobs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        return jobRepository.findByRecruiter(recruiter).stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponse createJob(String email, CreateJobRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            throw new IllegalArgumentException("Please configure your company profile before posting jobs.");
        }

        JobRole role = null;
        if (request.getJobRoleId() != null) {
            role = jobRoleRepository.findById(request.getJobRoleId()).orElse(null);
        }

        Job job = Job.builder()
                .recruiter(recruiter)
                .company(company)
                .jobRole(role)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .location(request.getLocation() != null ? request.getLocation() : "Remote / Hybrid")
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : "Full-time")
                .minCgpa(request.getMinCgpa() != null ? request.getMinCgpa() : 0.0)
                .salaryRangeMin(request.getSalaryRangeMin())
                .salaryRangeMax(request.getSalaryRangeMax())
                .applicationDeadline(request.getApplicationDeadline() != null ? request.getApplicationDeadline() : LocalDate.now().plusMonths(2))
                .isActive(true)
                .requiredSkills(new ArrayList<>())
                .build();

        Job savedJob = jobRepository.save(job);

        // Add Skill Requirements
        List<JobSkillRequirement> requirements = new ArrayList<>();
        for (var reqDto : request.getRequiredSkills()) {
            Skill skill = skillRepository.findById(reqDto.getSkillId())
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + reqDto.getSkillId()));

            JobSkillRequirement req = JobSkillRequirement.builder()
                    .job(savedJob)
                    .skill(skill)
                    .minProficiencyLevel(reqDto.getMinProficiencyLevel())
                    .weight(reqDto.getWeight() != null ? reqDto.getWeight() : 1.0)
                    .isMandatory(reqDto.getIsMandatory() != null ? reqDto.getIsMandatory() : true)
                    .build();
            requirements.add(req);
        }

        jobSkillRequirementRepository.saveAll(requirements);
        savedJob.setRequiredSkills(requirements);

        return mapToJobResponse(savedJob);
    }

    @Transactional
    public void deleteJob(String email, Long jobId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You can only delete jobs posted by your account.");
        }

        jobRepository.delete(job);
    }

    private JobResponse mapToJobResponse(Job job) {
        List<JobSkillResponse> skills = jobSkillRequirementRepository.findByJob(job).stream()
                .map(r -> JobSkillResponse.builder()
                        .id(r.getId())
                        .skillId(r.getSkill().getId())
                        .skillName(r.getSkill().getName())
                        .category(r.getSkill().getCategory())
                        .minProficiencyLevel(r.getMinProficiencyLevel())
                        .weight(r.getWeight())
                        .isMandatory(r.getIsMandatory())
                        .build())
                .collect(Collectors.toList());

        Company c = job.getCompany();

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyId(c != null ? c.getId() : null)
                .companyName(c != null ? c.getName() : "Enterprise Partner")
                .companyLocation(c != null ? c.getLocation() : "India")
                .companyLogoUrl(c != null ? c.getLogoUrl() : null)
                .jobRoleTitle(job.getJobRole() != null ? job.getJobRole().getTitle() : null)
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .minCgpa(job.getMinCgpa())
                .salaryRangeMin(job.getSalaryRangeMin())
                .salaryRangeMax(job.getSalaryRangeMax())
                .applicationDeadline(job.getApplicationDeadline())
                .isActive(job.getIsActive())
                .createdAt(job.getCreatedAt())
                .requiredSkills(skills)
                .build();
    }
}
