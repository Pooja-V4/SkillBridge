package com.skillbridge.repository;

import com.skillbridge.entity.LearningResource;
import com.skillbridge.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findBySkill(Skill skill);
    List<LearningResource> findBySkillId(Long skillId);
    List<LearningResource> findBySkillIdIn(List<Long> skillIds);
}
