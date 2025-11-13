package com.fintrackrx.repository;

import com.fintrackrx.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> {
    List<Investment> findByUserId(UUID userId);
    Optional<Investment> findByIdAndUserId(UUID id, UUID userId);
    List<Investment> findByUserIdAndSymbol(UUID userId, String symbol);
}
