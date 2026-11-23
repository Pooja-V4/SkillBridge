package com.skillbridge.dto.student;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationRequest {
    @NotBlank(message = "Certification name is required")
    private String name;
    private String issuingOrganization;
    private LocalDate issueDate;
    private String credentialUrl;
}
