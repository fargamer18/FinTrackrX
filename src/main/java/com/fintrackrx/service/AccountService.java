package com.fintrackrx.service;

import com.fintrackrx.model.Account;
import com.fintrackrx.model.User;
import com.fintrackrx.repository.AccountRepository;
import com.fintrackrx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<Account> getUserAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUserId(user.getId());
    }

    @Transactional
    public Account createAccount(String email, Account account) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        account.setUser(user);
        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(String email, UUID accountId, Account updatedAccount) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        account.setName(updatedAccount.getName());
        account.setType(updatedAccount.getType());
        account.setBalance(updatedAccount.getBalance());
        account.setCurrency(updatedAccount.getCurrency());
        account.setIsActive(updatedAccount.getIsActive());
        
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(String email, UUID accountId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        accountRepository.delete(account);
    }
}
