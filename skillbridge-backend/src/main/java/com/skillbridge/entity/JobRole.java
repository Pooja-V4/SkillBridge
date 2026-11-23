package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String title; // e.g. "Java Developer", "Full Stack Developer", "Data Analyst"

    @Column(length = 100)
    private String category; // e.g. "Software Engineering", "Data & AI"

    @Column(columnDefinition = "TEXT")
    private String description;
}
