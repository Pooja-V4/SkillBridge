package com.skillbridge.repository;

import com.skillbridge.entity.Project;
import com.skillbridge.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStudent(Student student);
    List<Project> findByStudentId(Long studentId);
}
