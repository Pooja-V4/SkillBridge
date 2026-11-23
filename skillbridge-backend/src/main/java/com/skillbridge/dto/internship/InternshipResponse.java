package com.skillbridge.dto.internship;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipResponse {
    private Long id;
    private String title;
    private String description;
    private Long companyId;
    private String companyName;
    private String companyLocation;
    private String companyLogoUrl;
    private String location;
    private Integer durationMonths;
    private Double stipendMonthly;
    private Double minCgpa;
    private LocalDate applicationDeadline;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<InternshipSkillResponse> requiredSkills;
}
