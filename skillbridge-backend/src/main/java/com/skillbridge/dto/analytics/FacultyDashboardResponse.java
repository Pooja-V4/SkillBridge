package com.skillbridge.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyDashboardResponse {
    private String departmentName;
    private Long totalStudents;
    private Long totalApplications;
    private Double averageCgpa;
    private Double averagePlacementReadiness;
    private List<SkillProficiencyStat> topDepartmentSkills;
    private List<SkillDeficitStat> criticalSkillDeficits;
    private Map<String, Long> applicationStatusDistribution;
    private List<StudentSummaryDto> recentStudents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillProficiencyStat {
        private String skillName;
        private Double averageProficiency;
        private Long studentCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillDeficitStat {
        private String skillName;
        private Long studentsDeficientCount;
        private String suggestedPlatform;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentSummaryDto {
        private Long id;
        private String name;
        private String rollNumber;
        private Double cgpa;
        private String targetCareerRole;
        private Integer skillsCount;
        private Double readinessScore;
    }
}
