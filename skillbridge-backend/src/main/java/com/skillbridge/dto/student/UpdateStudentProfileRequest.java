package com.skillbridge.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStudentProfileRequest {
    private String bio;
    private Double cgpa;
    private Integer academicYear;
    private Integer graduationYear;
    private String linkedinUrl;
    private String githubUrl;
    private String targetCareerRole;
}
