package com.fintrackrx.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_settings", indexes = {
    @Index(name = "idx_user_settings_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "theme_mode", length = 10)
    private String themeMode = "system"; // 'light' | 'dark' | 'system'

    @Column(name = "default_currency", length = 3)
    private String defaultCurrency = "INR";

    @Column(name = "date_format", length = 20)
    private String dateFormat = "DD/MM/YYYY";

    @Column(name = "number_format", length = 20)
    private String numberFormat = "standard"; // 'standard' | 'compact'

    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "chart_palette", columnDefinition = "TEXT")
    private JsonNode chartPalette;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
