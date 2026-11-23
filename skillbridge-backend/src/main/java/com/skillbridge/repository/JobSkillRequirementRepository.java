package com.skillbridge.repository;

import com.skillbridge.entity.Job;
import com.skillbridge.entity.JobSkillRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSkillRequirementRepository extends JpaRepository<JobSkillRequirement, Long> {
    List<JobSkillRequirement> findByJob(Job job);
    List<JobSkillRequirement> findByJobId(Long jobId);
}
