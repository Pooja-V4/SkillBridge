package com.skillbridge.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Long totalUsers;
    private Long totalStudents;
    private Long totalRecruiters;
    private Long totalFaculty;
    private Long totalJobs;
    private Long totalInternships;
    private Long totalApplications;
    private Long totalSkills;
    private Map<String, Long> userRoleDistribution;
    private Map<String, Long> applicationTypeDistribution;
    private List<RecentUserDto> recentUsers;
    private SystemHealthDto systemHealth;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentUserDto {
        private Long id;
        private String email;
        private String fullName;
        private String role;
        private Boolean isActive;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemHealthDto {
        private String databaseStatus;
        private String aiServiceStatus;
        private String springBootVersion;
        private Long activeSessions;
    }
}
