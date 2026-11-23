package com.skillbridge.dto.student;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {
    @NotBlank(message = "Project title is required")
    private String title;
    private String description;
    private String technologiesUsed;
    private String githubUrl;
    private String liveUrl;
}
