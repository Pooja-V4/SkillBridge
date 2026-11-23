package com.skillbridge.dto.job;

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
public class JobSkillRequirementRequest {

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Minimum proficiency level is required")
    @Min(value = 1, message = "Minimum proficiency is 1")
    @Max(value = 5, message = "Maximum proficiency is 5")
    private Integer minProficiencyLevel;

    @Builder.Default
    private Double weight = 1.0;

    @Builder.Default
    private Boolean isMandatory = true;
}
