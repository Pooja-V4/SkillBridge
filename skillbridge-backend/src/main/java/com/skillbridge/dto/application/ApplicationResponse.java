package com.skillbridge.dto.application;

import com.skillbridge.enums.ApplicationStatus;
import com.skillbridge.enums.ApplicationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private ApplicationType type;
    private ApplicationStatus status;
    private Double skillMatchPercentage;
    private String coverLetter;
    private String recruiterFeedback;
    private LocalDateTime appliedAt;

    // Student Details
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentRoll;
    private String departmentName;
    private Double studentCgpa;

    // Target Job/Internship Details
    private Long targetId;
    private String targetTitle;
    private String companyName;
    private String location;
}
