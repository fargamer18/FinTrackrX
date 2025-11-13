package com.fintrackrx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "investments", indexes = {
    @Index(name = "idx_investments_user_id", columnList = "user_id"),
    @Index(name = "idx_investments_symbol", columnList = "symbol")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String symbol; // Stock symbol (e.g., 'AAPL', 'RELIANCE.NS')

    @Column(nullable = false, length = 255)
    private String name; // Company name

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal quantity; // Number of shares

    @Column(name = "purchase_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal purchasePrice; // Price per share at purchase

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "current_price", precision = 15, scale = 2)
    private BigDecimal currentPrice; // Latest price (updated periodically)

    @Column(length = 3)
    private String currency = "USD";

    @Column(length = 50)
    private String exchange; // Exchange (e.g., 'NASDAQ', 'NSE')

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
