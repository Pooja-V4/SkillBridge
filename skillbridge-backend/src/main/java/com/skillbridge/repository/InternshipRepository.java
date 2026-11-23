package com.skillbridge.repository;

import com.skillbridge.entity.Company;
import com.skillbridge.entity.Internship;
import com.skillbridge.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByIsActiveTrue();
    List<Internship> findByRecruiter(Recruiter recruiter);
    List<Internship> findByRecruiterId(Long recruiterId);
}
