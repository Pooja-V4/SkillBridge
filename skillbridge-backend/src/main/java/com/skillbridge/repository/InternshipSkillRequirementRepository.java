package com.skillbridge.repository;

import com.skillbridge.entity.Internship;
import com.skillbridge.entity.InternshipSkillRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipSkillRequirementRepository extends JpaRepository<InternshipSkillRequirement, Long> {
    List<InternshipSkillRequirement> findByInternship(Internship internship);
    List<InternshipSkillRequirement> findByInternshipId(Long internshipId);
}
