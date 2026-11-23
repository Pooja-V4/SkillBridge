package com.skillbridge.repository;

import com.skillbridge.entity.LearningRoadmap;
import com.skillbridge.entity.RoadmapItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapItemRepository extends JpaRepository<RoadmapItem, Long> {
    List<RoadmapItem> findByRoadmapOrderBySequenceOrderAsc(LearningRoadmap roadmap);
}
