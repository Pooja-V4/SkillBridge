package com.skillbridge.entity;

import com.skillbridge.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "learning_resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(length = 100)
    private String platform; // Coursera, freeCodeCamp, MDN, Official Docs, Udemy

    @Column(nullable = false, length = 255)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DifficultyLevel difficulty;

    @Column(length = 50)
    private String estimatedDuration; // e.g. "12 hours", "4 weeks"

    @Column(columnDefinition = "TEXT")
    private String description;
}
