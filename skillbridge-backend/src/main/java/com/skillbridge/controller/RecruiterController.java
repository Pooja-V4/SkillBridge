package com.skillbridge.controller;

import com.skillbridge.dto.recruiter.CompanyResponse;
import com.skillbridge.dto.recruiter.UpdateCompanyRequest;
import com.skillbridge.service.RecruiterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recruiters")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PutMapping("/company")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CompanyResponse> updateCompany(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateCompanyRequest request
    ) {
        return ResponseEntity.ok(recruiterService.updateCompany(userDetails.getUsername(), request));
    }
}
