package com.skillbridge.dto.application;

import com.skillbridge.enums.ApplicationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitApplicationRequest {

    @NotNull(message = "Application type is required (JOB or INTERNSHIP)")
    private ApplicationType type;

    private Long jobId;

    private Long internshipId;

    private String coverLetter;
}
