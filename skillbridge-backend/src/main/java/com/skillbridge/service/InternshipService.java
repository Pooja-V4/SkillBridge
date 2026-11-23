package com.skillbridge.service;

import com.skillbridge.dto.internship.CreateInternshipRequest;
import com.skillbridge.dto.internship.InternshipResponse;
import com.skillbridge.dto.internship.InternshipSkillResponse;
import com.skillbridge.entity.*;
import com.skillbridge.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final SkillRepository skillRepository;
    private final InternshipSkillRequirementRepository requirementRepository;
    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;

    public InternshipService(
            InternshipRepository internshipRepository,
            SkillRepository skillRepository,
            InternshipSkillRequirementRepository requirementRepository,
            RecruiterRepository recruiterRepository,
            UserRepository userRepository
    ) {
        this.internshipRepository = internshipRepository;
        this.skillRepository = skillRepository;
        this.requirementRepository = requirementRepository;
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<InternshipResponse> getAllActiveInternships() {
        return internshipRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InternshipResponse getInternshipById(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with id: " + id));
        return mapToResponse(internship);
    }

    @Transactional(readOnly = true)
    public List<InternshipResponse> getMyPostedInternships(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        return internshipRepository.findByRecruiter(recruiter).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InternshipResponse createInternship(String email, CreateInternshipRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            throw new IllegalArgumentException("Please configure your company profile before posting internships.");
        }

        Internship internship = Internship.builder()
                .recruiter(recruiter)
                .company(company)
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .location(request.getLocation() != null ? request.getLocation() : "Remote / Hybrid")
                .durationMonths(request.getDurationMonths() != null ? request.getDurationMonths() : 3)
                .stipendMonthly(request.getStipendMonthly() != null ? request.getStipendMonthly() : 15000.0)
                .minCgpa(request.getMinCgpa() != null ? request.getMinCgpa() : 0.0)
                .applicationDeadline(request.getApplicationDeadline() != null ? request.getApplicationDeadline() : LocalDate.now().plusMonths(1))
                .isActive(true)
                .requiredSkills(new ArrayList<>())
                .build();

        Internship saved = internshipRepository.save(internship);

        List<InternshipSkillRequirement> requirements = new ArrayList<>();
        for (var reqDto : request.getRequiredSkills()) {
            Skill skill = skillRepository.findById(reqDto.getSkillId())
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + reqDto.getSkillId()));

            InternshipSkillRequirement req = InternshipSkillRequirement.builder()
                    .internship(saved)
                    .skill(skill)
                    .minProficiencyLevel(reqDto.getMinProficiencyLevel())
                    .weight(reqDto.getWeight() != null ? reqDto.getWeight() : 1.0)
                    .isMandatory(reqDto.getIsMandatory() != null ? reqDto.getIsMandatory() : true)
                    .build();
            requirements.add(req);
        }

        requirementRepository.saveAll(requirements);
        saved.setRequiredSkills(requirements);

        return mapToResponse(saved);
    }

    @Transactional
    public void deleteInternship(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found"));

        if (!internship.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You can only delete internship postings created by your account.");
        }

        internshipRepository.delete(internship);
    }

    private InternshipResponse mapToResponse(Internship intern) {
        List<InternshipSkillResponse> skills = requirementRepository.findByInternship(intern).stream()
                .map(r -> InternshipSkillResponse.builder()
                        .id(r.getId())
                        .skillId(r.getSkill().getId())
                        .skillName(r.getSkill().getName())
                        .category(r.getSkill().getCategory())
                        .minProficiencyLevel(r.getMinProficiencyLevel())
                        .weight(r.getWeight())
                        .isMandatory(r.getIsMandatory())
                        .build())
                .collect(Collectors.toList());

        Company c = intern.getCompany();

        return InternshipResponse.builder()
                .id(intern.getId())
                .title(intern.getTitle())
                .description(intern.getDescription())
                .companyId(c != null ? c.getId() : null)
                .companyName(c != null ? c.getName() : "Enterprise Partner")
                .companyLocation(c != null ? c.getLocation() : "India")
                .companyLogoUrl(c != null ? c.getLogoUrl() : null)
                .location(intern.getLocation())
                .durationMonths(intern.getDurationMonths())
                .stipendMonthly(intern.getStipendMonthly())
                .minCgpa(intern.getMinCgpa())
                .applicationDeadline(intern.getApplicationDeadline())
                .isActive(intern.getIsActive())
                .createdAt(intern.getCreatedAt())
                .requiredSkills(skills)
                .build();
    }
}
