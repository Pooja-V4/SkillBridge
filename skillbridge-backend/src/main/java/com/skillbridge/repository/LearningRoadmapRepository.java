package com.skillbridge.repository;

import com.skillbridge.entity.LearningRoadmap;
import com.skillbridge.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    List<LearningRoadmap> findByStudentOrderByCreatedAtDesc(Student student);
    Optional<LearningRoadmap> findFirstByStudentOrderByCreatedAtDesc(Student student);
}
