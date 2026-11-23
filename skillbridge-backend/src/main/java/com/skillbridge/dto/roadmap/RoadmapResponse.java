package com.skillbridge.dto.roadmap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapResponse {
    private Long id;
    private String targetRole;
    private Double completionPercentage;
    private Integer totalMilestones;
    private Integer completedMilestones;
    private LocalDateTime createdAt;
    private List<RoadmapItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapItemDto {
        private Long id;
        private Long resourceId;
        private String skillName;
        private String resourceTitle;
        private String platform;
        private String url;
        private String difficulty;
        private String estimatedDuration;
        private Integer sequenceOrder;
        private Boolean isCompleted;
    }
}
