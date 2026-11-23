package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_skill_requirements", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_id", "skill_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkillRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer minProficiencyLevel; // 1 to 5

    @Builder.Default
    @Column(nullable = false)
    private Double weight = 1.0; // Weight in match algorithm, e.g. 1.0 = standard, 2.0 = core

    @Builder.Default
    @Column(nullable = false)
    private Boolean isMandatory = true;
}
