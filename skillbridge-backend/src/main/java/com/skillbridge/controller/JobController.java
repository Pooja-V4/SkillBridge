package com.skillbridge.controller;

import com.skillbridge.dto.job.CreateJobRequest;
import com.skillbridge.dto.job.JobResponse;
import com.skillbridge.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllActiveJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<JobResponse>> getMyPostedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getMyPostedJobs(userDetails.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> createJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateJobRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> deleteJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        jobService.deleteJob(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
