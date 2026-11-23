package com.skillbridge.dto.job;

import com.skillbridge.enums.SkillCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSkillResponse {
    private Long id;
    private Long skillId;
    private String skillName;
    private SkillCategory category;
    private Integer minProficiencyLevel;
    private Double weight;
    private Boolean isMandatory;
}
