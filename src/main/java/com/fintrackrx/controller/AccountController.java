package com.fintrackrx.controller;

import com.fintrackrx.dto.ApiResponse;
import com.fintrackrx.model.Account;
import com.fintrackrx.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAccounts(Authentication authentication) {
        try {
            List<Account> accounts = accountService.getUserAccounts(authentication.getName());
            return ResponseEntity.ok(ApiResponse.success(accounts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Account>> createAccount(
            @RequestBody Account account,
            Authentication authentication) {
        try {
            Account created = accountService.createAccount(authentication.getName(), account);
            return ResponseEntity.ok(ApiResponse.success("Account created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> updateAccount(
            @PathVariable UUID id,
            @RequestBody Account account,
            Authentication authentication) {
        try {
            Account updated = accountService.updateAccount(authentication.getName(), id, account);
            return ResponseEntity.ok(ApiResponse.success("Account updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAccount(
            @PathVariable UUID id,
            Authentication authentication) {
        try {
            accountService.deleteAccount(authentication.getName(), id);
            return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", "deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
