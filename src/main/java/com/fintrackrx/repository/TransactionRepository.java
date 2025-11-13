package com.fintrackrx.repository;

import com.fintrackrx.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserId(UUID userId);
    
    List<Transaction> findByUserIdAndDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndType(UUID userId, String type);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.date >= :startDate ORDER BY t.date DESC")
    List<Transaction> findRecentTransactions(@Param("userId") UUID userId, @Param("startDate") LocalDate startDate);
}
