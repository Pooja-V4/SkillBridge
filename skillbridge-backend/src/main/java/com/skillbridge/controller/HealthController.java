package com.skillbridge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "SkillBridge Backend API");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now().toString());

        // Verify direct database connectivity
        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            response.put("database", isValid ? "CONNECTED" : "UNHEALTHY");
            response.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
            response.put("databaseVersion", connection.getMetaData().getDatabaseProductVersion());
        } catch (SQLException e) {
            response.put("database", "DISCONNECTED: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
