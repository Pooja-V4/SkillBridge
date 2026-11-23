package com.skillbridge.dto.job;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    private Long jobRoleId;

    @NotBlank(message = "Job description is required")
    private String description;

    private String location;

    private String employmentType; // Full-time, Remote, Hybrid

    private Double minCgpa;

    private Double salaryRangeMin;

    private Double salaryRangeMax;

    private LocalDate applicationDeadline;

    @NotEmpty(message = "At least one skill requirement is required")
    @Valid
    private List<JobSkillRequirementRequest> requiredSkills;
}
