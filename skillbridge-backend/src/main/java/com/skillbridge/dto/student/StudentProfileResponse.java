package com.skillbridge.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String rollNumber;
    private String departmentName;
    private String departmentCode;
    private Integer academicYear;
    private Integer graduationYear;
    private Double cgpa;
    private String bio;
    private String linkedinUrl;
    private String githubUrl;
    private String targetCareerRole;
    private List<StudentSkillResponse> skills;
    private List<ProjectResponse> projects;
    private List<CertificationResponse> certifications;
}
