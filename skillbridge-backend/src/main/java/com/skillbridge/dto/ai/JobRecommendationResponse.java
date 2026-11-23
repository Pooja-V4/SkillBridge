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
public class JobRecommendationResponse {
    private Integer totalEvaluated;
    private List<RankedJobDto> recommendations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankedJobDto {
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private Double tfidfSimilarityScore;
        private Double weightedSkillMatchPercentage;
        private Double combinedRecommendationScore;
        private List<String> missingCoreSkills;
    }
}
