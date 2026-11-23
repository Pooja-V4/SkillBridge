package com.skillbridge.dto.student;

import com.skillbridge.enums.SkillCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSkillResponse {
    private Long id;
    private Long skillId;
    private String skillName;
    private SkillCategory category;
    private Integer proficiencyLevel;
    private Integer experienceMonths;
    private String evidenceProject;
}
