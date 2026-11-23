package com.skillbridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_skills", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "skill_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer proficiencyLevel; // Scale: 1 = Beginner to 5 = Expert

    private Integer experienceMonths;

    @Column(length = 255)
    private String evidenceProject;
}
