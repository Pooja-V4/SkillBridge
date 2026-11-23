package com.skillbridge.dto.internship;

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
public class CreateInternshipRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String location;

    private Integer durationMonths;

    private Double stipendMonthly;

    private Double minCgpa;

    private LocalDate applicationDeadline;

    @NotEmpty(message = "At least one skill requirement is required")
    @Valid
    private List<InternshipSkillRequirementRequest> requiredSkills;
}
