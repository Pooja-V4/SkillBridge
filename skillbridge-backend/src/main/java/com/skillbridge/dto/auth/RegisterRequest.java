package com.skillbridge.dto.auth;

import com.skillbridge.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phone;

    @NotNull(message = "Role is required (STUDENT, FACULTY, RECRUITER, ADMIN)")
    private RoleType role;

    // Student profile specifics (optional during registration, can be completed in profile)
    private String rollNumber;
    private String departmentCode;
    private Integer academicYear;
    private Double cgpa;

    // Recruiter profile specifics
    private String companyName;
    private String designation;
}
