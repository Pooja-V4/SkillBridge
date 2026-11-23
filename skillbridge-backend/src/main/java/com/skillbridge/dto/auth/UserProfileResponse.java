package com.skillbridge.dto.auth;

import com.skillbridge.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private RoleType role;
    private Long profileId; // studentId, facultyId, or recruiterId
    private String department;
    private String company;
    private Double cgpa;
}
