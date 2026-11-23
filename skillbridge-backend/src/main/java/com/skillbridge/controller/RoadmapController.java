package com.skillbridge.controller;

import com.skillbridge.dto.roadmap.RoadmapResponse;
import com.skillbridge.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RoadmapResponse> getMyRoadmap(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(roadmapService.getStudentCurrentRoadmap(userDetails.getUsername()));
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RoadmapResponse> generateRoadmap(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) Map<String, String> request
    ) {
        String role = request != null ? request.get("targetRole") : null;
        return ResponseEntity.ok(roadmapService.generatePersonalizedRoadmap(userDetails.getUsername(), role));
    }

    @PatchMapping("/items/{itemId}/toggle")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<RoadmapResponse> toggleMilestone(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(roadmapService.toggleMilestoneCompletion(userDetails.getUsername(), itemId));
    }
}
