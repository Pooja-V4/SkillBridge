package com.skillbridge.service;

import com.skillbridge.dto.student.*;
import com.skillbridge.entity.*;
import com.skillbridge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;

    public StudentService(
            StudentRepository studentRepository,
            UserRepository userRepository,
            SkillRepository skillRepository,
            StudentSkillRepository studentSkillRepository,
            ProjectRepository projectRepository,
            CertificationRepository certificationRepository
    ) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.projectRepository = projectRepository;
        this.certificationRepository = certificationRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user: " + email));

        return mapToProfileResponse(student);
    }

    @Transactional
    public StudentProfileResponse updateProfile(String email, UpdateStudentProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user: " + email));

        if (req.getBio() != null) student.setBio(req.getBio().trim());
        if (req.getCgpa() != null) student.setCgpa(req.getCgpa());
        if (req.getAcademicYear() != null) student.setAcademicYear(req.getAcademicYear());
        if (req.getGraduationYear() != null) student.setGraduationYear(req.getGraduationYear());
        if (req.getLinkedinUrl() != null) student.setLinkedinUrl(req.getLinkedinUrl().trim());
        if (req.getGithubUrl() != null) student.setGithubUrl(req.getGithubUrl().trim());
        if (req.getTargetCareerRole() != null) student.setTargetCareerRole(req.getTargetCareerRole().trim());

        Student updated = studentRepository.save(student);
        return mapToProfileResponse(updated);
    }

    @Transactional
    public StudentSkillResponse addOrUpdateSkill(String email, AddSkillRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        Skill skill = skillRepository.findById(req.getSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found with ID: " + req.getSkillId()));

        StudentSkill studentSkill = studentSkillRepository.findByStudentIdAndSkillId(student.getId(), skill.getId())
                .orElseGet(() -> StudentSkill.builder().student(student).skill(skill).build());

        studentSkill.setProficiencyLevel(req.getProficiencyLevel());
        studentSkill.setExperienceMonths(req.getExperienceMonths());
        studentSkill.setEvidenceProject(req.getEvidenceProject());

        StudentSkill saved = studentSkillRepository.save(studentSkill);

        return StudentSkillResponse.builder()
                .id(saved.getId())
                .skillId(skill.getId())
                .skillName(skill.getName())
                .category(skill.getCategory())
                .proficiencyLevel(saved.getProficiencyLevel())
                .experienceMonths(saved.getExperienceMonths())
                .evidenceProject(saved.getEvidenceProject())
                .build();
    }

    @Transactional
    public void deleteSkill(String email, Long studentSkillId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        studentSkillRepository.deleteByStudentIdAndId(student.getId(), studentSkillId);
    }

    @Transactional
    public ProjectResponse addProject(String email, ProjectRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        Project project = Project.builder()
                .student(student)
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .technologiesUsed(req.getTechnologiesUsed())
                .githubUrl(req.getGithubUrl())
                .liveUrl(req.getLiveUrl())
                .build();

        Project saved = projectRepository.save(project);
        return ProjectResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .technologiesUsed(saved.getTechnologiesUsed())
                .githubUrl(saved.getGithubUrl())
                .liveUrl(saved.getLiveUrl())
                .build();
    }

    @Transactional
    public CertificationResponse addCertification(String email, CertificationRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        Certification cert = Certification.builder()
                .student(student)
                .name(req.getName().trim())
                .issuingOrganization(req.getIssuingOrganization())
                .issueDate(req.getIssueDate())
                .credentialUrl(req.getCredentialUrl())
                .build();

        Certification saved = certificationRepository.save(cert);
        return CertificationResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .issuingOrganization(saved.getIssuingOrganization())
                .issueDate(saved.getIssueDate())
                .credentialUrl(saved.getCredentialUrl())
                .build();
    }

    private StudentProfileResponse mapToProfileResponse(Student s) {
        User u = s.getUser();
        List<StudentSkillResponse> skills = studentSkillRepository.findByStudent(s).stream()
                .map(ss -> StudentSkillResponse.builder()
                        .id(ss.getId())
                        .skillId(ss.getSkill().getId())
                        .skillName(ss.getSkill().getName())
                        .category(ss.getSkill().getCategory())
                        .proficiencyLevel(ss.getProficiencyLevel())
                        .experienceMonths(ss.getExperienceMonths())
                        .evidenceProject(ss.getEvidenceProject())
                        .build())
                .collect(Collectors.toList());

        List<ProjectResponse> projects = projectRepository.findByStudent(s).stream()
                .map(p -> ProjectResponse.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .description(p.getDescription())
                        .technologiesUsed(p.getTechnologiesUsed())
                        .githubUrl(p.getGithubUrl())
                        .liveUrl(p.getLiveUrl())
                        .build())
                .collect(Collectors.toList());

        List<CertificationResponse> certs = certificationRepository.findByStudent(s).stream()
                .map(c -> CertificationResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .issuingOrganization(c.getIssuingOrganization())
                        .issueDate(c.getIssueDate())
                        .credentialUrl(c.getCredentialUrl())
                        .build())
                .collect(Collectors.toList());

        return StudentProfileResponse.builder()
                .id(s.getId())
                .userId(u.getId())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .phone(u.getPhone())
                .rollNumber(s.getRollNumber())
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : "Computer Science & Engineering")
                .departmentCode(s.getDepartment() != null ? s.getDepartment().getCode() : "CSE")
                .academicYear(s.getAcademicYear())
                .graduationYear(s.getGraduationYear())
                .cgpa(s.getCgpa())
                .bio(s.getBio())
                .linkedinUrl(s.getLinkedinUrl())
                .githubUrl(s.getGithubUrl())
                .targetCareerRole(s.getTargetCareerRole())
                .skills(skills)
                .projects(projects)
                .certifications(certs)
                .build();
    }
}
