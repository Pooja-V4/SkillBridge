package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internship_skill_requirements", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"internship_id", "skill_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternshipSkillRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer minProficiencyLevel; // 1 to 5

    @Builder.Default
    @Column(nullable = false)
    private Double weight = 1.0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isMandatory = true;
}
