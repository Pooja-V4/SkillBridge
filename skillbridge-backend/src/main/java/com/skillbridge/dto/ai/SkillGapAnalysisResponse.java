package com.skillbridge.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapAnalysisResponse {
    private String targetRole;
    private Double overallMatchPercentage;
    private Integer totalRequiredSkills;
    private Integer matchedSkillsCount;
    private Integer partialSkillsCount;
    private Integer missingSkillsCount;
    private List<SkillEvaluationDto> evaluations;
    private String summaryMessage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillEvaluationDto {
        private Long skillId;
        private String skillName;
        private Integer requiredLevel;
        private Integer studentLevel;
        private Integer gap;
        private Double weight;
        private Boolean isMandatory;
        private String status;   // MATCHED, PARTIAL, MISSING
        private String priority; // HIGH, MEDIUM, LOW
    }
}
