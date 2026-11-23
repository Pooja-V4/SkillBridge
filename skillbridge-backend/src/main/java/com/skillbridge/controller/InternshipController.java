package com.skillbridge.controller;

import com.skillbridge.dto.internship.CreateInternshipRequest;
import com.skillbridge.dto.internship.InternshipResponse;
import com.skillbridge.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internships")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping
    public ResponseEntity<List<InternshipResponse>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllActiveInternships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipResponse> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<InternshipResponse>> getMyInternships(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(internshipService.getMyPostedInternships(userDetails.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<InternshipResponse> createInternship(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateInternshipRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internshipService.createInternship(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> deleteInternship(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        internshipService.deleteInternship(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
