package com.skillbridge.repository;

import com.skillbridge.entity.Application;
import com.skillbridge.entity.Student;
import com.skillbridge.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByStudentId(Long studentId);
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    Optional<Application> findByStudentIdAndInternshipId(Long studentId, Long internshipId);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);

    @Query("SELECT a FROM Application a WHERE (a.job.recruiter.id = :recruiterId) OR (a.internship.recruiter.id = :recruiterId)")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    List<Application> findByJobIsNotNull();
    List<Application> findByInternshipIsNotNull();
}
