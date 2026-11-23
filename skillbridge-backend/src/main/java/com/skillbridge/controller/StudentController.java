package com.skillbridge.controller;

import com.skillbridge.dto.student.*;
import com.skillbridge.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getProfileByEmail(userDetails.getUsername()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentProfileRequest request
    ) {
        return ResponseEntity.ok(studentService.updateProfile(userDetails.getUsername(), request));
    }

    @PostMapping("/me/skills")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentSkillResponse> addOrUpdateSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddSkillRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addOrUpdateSkill(userDetails.getUsername(), request));
    }

    @DeleteMapping("/me/skills/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> deleteSkill(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        studentService.deleteSkill(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/projects")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProjectResponse> addProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProjectRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addProject(userDetails.getUsername(), request));
    }

    @PostMapping("/me/certifications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CertificationResponse> addCertification(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CertificationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addCertification(userDetails.getUsername(), request));
    }
}
