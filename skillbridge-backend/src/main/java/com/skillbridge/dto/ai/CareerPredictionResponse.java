package com.skillbridge.dto.ai;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPredictionResponse {
    @JsonProperty("predictedRole")
    @JsonAlias("predicted_role")
    private String predictedRole;

    private double confidence;

    @JsonProperty("confidencePercentage")
    @JsonAlias("confidence_percentage")
    private double confidencePercentage;

    @JsonProperty("topRecommendations")
    @JsonAlias("top_recommendations")
    @Builder.Default
    private List<CareerProbabilityDto> topRecommendations = new ArrayList<>();

    @JsonProperty("modelVersion")
    @JsonAlias("model_version")
    private String modelVersion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerProbabilityDto {
        private String role;
        private double probability;
        private double percentage;
    }
}
