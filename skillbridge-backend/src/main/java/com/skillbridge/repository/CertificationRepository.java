package com.skillbridge.repository;

import com.skillbridge.entity.Certification;
import com.skillbridge.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByStudent(Student student);
    List<Certification> findByStudentId(Long studentId);
}
