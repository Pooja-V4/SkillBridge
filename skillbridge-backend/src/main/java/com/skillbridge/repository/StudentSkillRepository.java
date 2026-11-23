package com.skillbridge.repository;

import com.skillbridge.entity.Student;
import com.skillbridge.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudent(Student student);
    Optional<StudentSkill> findByStudentIdAndSkillId(Long studentId, Long skillId);
    void deleteByStudentIdAndId(Long studentId, Long id);
}
