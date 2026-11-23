package com.skillbridge.dto.job;

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
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private Long companyId;
    private String companyName;
    private String companyLocation;
    private String companyLogoUrl;
    private String jobRoleTitle;
    private String location;
    private String employmentType;
    private Double minCgpa;
    private Double salaryRangeMin;
    private Double salaryRangeMax;
    private LocalDate applicationDeadline;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<JobSkillResponse> requiredSkills;
}
