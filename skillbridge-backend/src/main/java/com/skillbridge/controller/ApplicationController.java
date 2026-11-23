package com.skillbridge.controller;

import com.skillbridge.dto.application.ApplicationResponse;
import com.skillbridge.dto.application.SubmitApplicationRequest;
import com.skillbridge.dto.application.UpdateStatusRequest;
import com.skillbridge.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponse> submitApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitApplicationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.submitApplication(userDetails.getUsername(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUsername()));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> getRecruiterApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getRecruiterApplications(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(userDetails.getUsername(), id, request));
    }
}
