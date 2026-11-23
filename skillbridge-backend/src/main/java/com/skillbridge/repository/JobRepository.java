package com.skillbridge.repository;

import com.skillbridge.entity.Job;
import com.skillbridge.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
    List<Job> findByRecruiter(Recruiter recruiter);
    List<Job> findByRecruiterId(Long recruiterId);
}
