package com.fintrackrx.repository;

import com.fintrackrx.model.Insight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InsightRepository extends JpaRepository<Insight, UUID> {
    List<Insight> findByUserId(UUID userId);
    List<Insight> findByUserIdAndIsRead(UUID userId, Boolean isRead);
}
