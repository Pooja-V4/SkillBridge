package com.skillbridge.controller;

import com.skillbridge.dto.skill.SkillResponse;
import com.skillbridge.enums.SkillCategory;
import com.skillbridge.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getAllSkills(
            @RequestParam(required = false) SkillCategory category
    ) {
        if (category != null) {
            return ResponseEntity.ok(skillService.getSkillsByCategory(category));
        }
        return ResponseEntity.ok(skillService.getAllSkills());
    }
}
