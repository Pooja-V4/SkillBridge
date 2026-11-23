package com.skillbridge.service;

import com.skillbridge.dto.application.ApplicationResponse;
import com.skillbridge.dto.application.SubmitApplicationRequest;
import com.skillbridge.dto.application.UpdateStatusRequest;
import com.skillbridge.entity.*;
import com.skillbridge.enums.ApplicationStatus;
import com.skillbridge.enums.ApplicationType;
import com.skillbridge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final RecruiterRepository recruiterRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            InternshipRepository internshipRepository,
            StudentSkillRepository studentSkillRepository,
            RecruiterRepository recruiterRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.recruiterRepository = recruiterRepository;
    }

    @Transactional
    public ApplicationResponse submitApplication(String email, SubmitApplicationRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        Job job = null;
        Internship internship = null;
        double calculatedMatch = 0.0;

        if (req.getType() == ApplicationType.JOB) {
            if (req.getJobId() == null) {
                throw new IllegalArgumentException("Job ID is required for job applications.");
            }
            if (applicationRepository.existsByStudentIdAndJobId(student.getId(), req.getJobId())) {
                throw new IllegalArgumentException("You have already submitted an application for this job opening.");
            }
            job = jobRepository.findById(req.getJobId())
                    .orElseThrow(() -> new IllegalArgumentException("Job not found: " + req.getJobId()));
            calculatedMatch = calculateSkillMatchForJob(student, job);
        } else {
            if (req.getInternshipId() == null) {
                throw new IllegalArgumentException("Internship ID is required for internship applications.");
            }
            if (applicationRepository.existsByStudentIdAndInternshipId(student.getId(), req.getInternshipId())) {
                throw new IllegalArgumentException("You have already submitted an application for this internship.");
            }
            internship = internshipRepository.findById(req.getInternshipId())
                    .orElseThrow(() -> new IllegalArgumentException("Internship not found: " + req.getInternshipId()));
            calculatedMatch = calculateSkillMatchForInternship(student, internship);
        }

        Application application = Application.builder()
                .student(student)
                .type(req.getType())
                .job(job)
                .internship(internship)
                .status(ApplicationStatus.APPLIED)
                .skillMatchPercentage(calculatedMatch)
                .coverLetter(req.getCoverLetter())
                .build();

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        return applicationRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getRecruiterApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        return applicationRepository.findByRecruiterId(recruiter.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(String email, Long applicationId, UpdateStatusRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        // Verify that this recruiter posted this job or internship
        Long ownerRecruiterId = app.getJob() != null ? app.getJob().getRecruiter().getId() : app.getInternship().getRecruiter().getId();
        if (!ownerRecruiterId.equals(recruiter.getId())) {
            throw new IllegalArgumentException("Unauthorized: You can only update applications for your postings.");
        }

        app.setStatus(req.getStatus());
        if (req.getRecruiterFeedback() != null) {
            app.setRecruiterFeedback(req.getRecruiterFeedback().trim());
        }

        Application saved = applicationRepository.save(app);
        return mapToResponse(saved);
    }

    /**
     * Rule-Based Weighted Skill Match Percentage (Phase 9 Preview & Application Record)
     * Match = [Sum of (Weight_i * min(Student_i, Required_i))] / [Sum of (Weight_i * Required_i)] * 100
     */
    private double calculateSkillMatchForJob(Student student, Job job) {
        List<JobSkillRequirement> requirements = job.getRequiredSkills();
        if (requirements.isEmpty()) return 100.0;

        Map<Long, Integer> studentSkills = studentSkillRepository.findByStudent(student).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiencyLevel));

        double weightedEarned = 0.0;
        double weightedTotal = 0.0;

        for (var req : requirements) {
            int studentLvl = studentSkills.getOrDefault(req.getSkill().getId(), 0);
            int requiredLvl = req.getMinProficiencyLevel();
            double weight = req.getWeight();

            weightedEarned += weight * Math.min(studentLvl, requiredLvl);
            weightedTotal += weight * requiredLvl;
        }

        if (weightedTotal == 0.0) return 100.0;
        return Math.round((weightedEarned / weightedTotal) * 1000.0) / 10.0;
    }

    private double calculateSkillMatchForInternship(Student student, Internship internship) {
        List<InternshipSkillRequirement> requirements = internship.getRequiredSkills();
        if (requirements.isEmpty()) return 100.0;

        Map<Long, Integer> studentSkills = studentSkillRepository.findByStudent(student).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiencyLevel));

        double weightedEarned = 0.0;
        double weightedTotal = 0.0;

        for (var req : requirements) {
            int studentLvl = studentSkills.getOrDefault(req.getSkill().getId(), 0);
            int requiredLvl = req.getMinProficiencyLevel();
            double weight = req.getWeight();

            weightedEarned += weight * Math.min(studentLvl, requiredLvl);
            weightedTotal += weight * requiredLvl;
        }

        if (weightedTotal == 0.0) return 100.0;
        return Math.round((weightedEarned / weightedTotal) * 1000.0) / 10.0;
    }

    private ApplicationResponse mapToResponse(Application app) {
        Student s = app.getStudent();
        User u = s.getUser();

        String targetTitle = app.getJob() != null ? app.getJob().getTitle() : app.getInternship().getTitle();
        String companyName = app.getJob() != null ? app.getJob().getCompany().getName() : app.getInternship().getCompany().getName();
        String location = app.getJob() != null ? app.getJob().getLocation() : app.getInternship().getLocation();
        Long targetId = app.getJob() != null ? app.getJob().getId() : app.getInternship().getId();

        return ApplicationResponse.builder()
                .id(app.getId())
                .type(app.getType())
                .status(app.getStatus())
                .skillMatchPercentage(app.getSkillMatchPercentage())
                .coverLetter(app.getCoverLetter())
                .recruiterFeedback(app.getRecruiterFeedback())
                .appliedAt(app.getAppliedAt())
                .studentId(s.getId())
                .studentName(u.getFirstName() + " " + u.getLastName())
                .studentEmail(u.getEmail())
                .studentRoll(s.getRollNumber())
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : "Computer Science & Engineering")
                .studentCgpa(s.getCgpa())
                .targetId(targetId)
                .targetTitle(targetTitle)
                .companyName(companyName)
                .location(location)
                .build();
    }
}
