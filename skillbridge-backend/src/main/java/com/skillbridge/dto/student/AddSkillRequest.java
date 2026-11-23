package com.skillbridge.dto.student;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddSkillRequest {

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Proficiency level is required")
    @Min(value = 1, message = "Proficiency must be at least 1 (Beginner)")
    @Max(value = 5, message = "Proficiency cannot exceed 5 (Expert)")
    private Integer proficiencyLevel;

    private Integer experienceMonths;

    private String evidenceProject;
}
