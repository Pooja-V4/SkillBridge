package com.skillbridge.controller;

import com.skillbridge.dto.ai.CareerPredictionResponse;
import com.skillbridge.dto.ai.JobRecommendationResponse;
import com.skillbridge.dto.ai.SkillGapAnalysisResponse;
import com.skillbridge.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/skill-gap")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SkillGapAnalysisResponse> getSkillGap(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String targetRole,
            @RequestParam(required = false) Long jobId
    ) {
        return ResponseEntity.ok(aiService.analyzeStudentSkillGap(userDetails.getUsername(), targetRole, jobId));
    }

    @PostMapping("/skill-gap")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SkillGapAnalysisResponse> postSkillGap(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) java.util.Map<String, Object> body
    ) {
        String targetRole = body != null && body.containsKey("targetRole") ? (String) body.get("targetRole") : null;
        Long jobId = null;
        if (body != null && body.containsKey("targetJobId") && body.get("targetJobId") != null) {
            jobId = Long.valueOf(body.get("targetJobId").toString());
        }
        return ResponseEntity.ok(aiService.analyzeStudentSkillGap(userDetails.getUsername(), targetRole, jobId));
    }

    @GetMapping("/job-recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<JobRecommendationResponse> getJobRecommendations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(aiService.recommendJobsForStudent(userDetails.getUsername()));
    }

    @GetMapping("/career-prediction")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CareerPredictionResponse> getCareerPrediction(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(aiService.predictStudentCareer(userDetails.getUsername()));
    }
}
