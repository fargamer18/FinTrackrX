package com.fintrackrx.service;

import com.fintrackrx.model.Investment;
import com.fintrackrx.model.User;
import com.fintrackrx.repository.InvestmentRepository;
import com.fintrackrx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;

    public List<Investment> getUserInvestments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return investmentRepository.findByUserId(user.getId());
    }

    @Transactional
    public Investment createInvestment(String email, Investment investment) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        investment.setUser(user);
        return investmentRepository.save(investment);
    }

    @Transactional
    public Investment updateInvestment(String email, UUID investmentId, Investment updatedInvestment) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Investment investment = investmentRepository.findByIdAndUserId(investmentId, user.getId())
                .orElseThrow(() -> new RuntimeException("Investment not found"));
        
        investment.setSymbol(updatedInvestment.getSymbol());
        investment.setName(updatedInvestment.getName());
        investment.setQuantity(updatedInvestment.getQuantity());
        investment.setPurchasePrice(updatedInvestment.getPurchasePrice());
        investment.setPurchaseDate(updatedInvestment.getPurchaseDate());
        investment.setCurrentPrice(updatedInvestment.getCurrentPrice());
        investment.setCurrency(updatedInvestment.getCurrency());
        investment.setExchange(updatedInvestment.getExchange());
        investment.setNotes(updatedInvestment.getNotes());
        
        return investmentRepository.save(investment);
    }

    @Transactional
    public void deleteInvestment(String email, UUID investmentId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Investment investment = investmentRepository.findByIdAndUserId(investmentId, user.getId())
                .orElseThrow(() -> new RuntimeException("Investment not found"));
        
        investmentRepository.delete(investment);
    }
}
