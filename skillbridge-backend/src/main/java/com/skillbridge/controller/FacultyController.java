package com.skillbridge.controller;

import com.skillbridge.dto.analytics.FacultyDashboardResponse;
import com.skillbridge.service.FacultyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<FacultyDashboardResponse> getFacultyDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(facultyService.getFacultyAnalytics(userDetails.getUsername()));
    }
}
