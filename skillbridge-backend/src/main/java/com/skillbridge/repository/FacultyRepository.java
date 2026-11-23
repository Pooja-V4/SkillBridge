package com.skillbridge.repository;

import com.skillbridge.entity.Faculty;
import com.skillbridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUser(User user);
    Optional<Faculty> findByUserId(Long userId);
}
