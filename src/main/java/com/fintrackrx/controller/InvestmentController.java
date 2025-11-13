package com.fintrackrx.controller;

import com.fintrackrx.dto.ApiResponse;
import com.fintrackrx.model.Investment;
import com.fintrackrx.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Investment>>> getInvestments(Authentication authentication) {
        try {
            List<Investment> investments = investmentService.getUserInvestments(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success(investments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Investment>> createInvestment(
            @RequestBody Investment investment,
            Authentication authentication) {
        try {
            Investment created = investmentService.createInvestment(authentication.getName(), investment);
            return ResponseEntity.ok(ApiResponse.success("Investment created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Investment>> updateInvestment(
            @PathVariable UUID id,
            @RequestBody Investment investment,
            Authentication authentication) {
        try {
            Investment updated = investmentService.updateInvestment(authentication.getName(), id, investment);
            return ResponseEntity.ok(ApiResponse.success("Investment updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteInvestment(
            @PathVariable UUID id,
            Authentication authentication) {
        try {
            investmentService.deleteInvestment(authentication.getName(), id);
            return ResponseEntity.ok(ApiResponse.success("Investment deleted successfully", "deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
