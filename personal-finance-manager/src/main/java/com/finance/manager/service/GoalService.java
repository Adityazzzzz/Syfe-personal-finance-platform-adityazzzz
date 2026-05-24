package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.BadRequestException;
import com.finance.manager.exception.ForbiddenException;
import com.finance.manager.exception.ResourceNotFoundException;
import com.finance.manager.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {
    
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    
    public GoalService(GoalRepository goalRepository, 
                       UserRepository userRepository,
                       TransactionRepository transactionRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }
    
    @Transactional
    public GoalResponse createGoal(Long userId, GoalRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LocalDate targetDate = LocalDate.parse(request.getTargetDate());
        if (!targetDate.isAfter(LocalDate.now())) {
            throw new BadRequestException("Target date must be a future date");
        }
        
        LocalDate startDate = request.getStartDate() != null ? 
            LocalDate.parse(request.getStartDate()) : LocalDate.now();
        
        Goal goal = new Goal();
        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(targetDate);
        goal.setStartDate(startDate);
        goal.setUser(user);
        
        Goal saved = goalRepository.save(goal);
        return mapToResponse(saved, userId);
    }
    
    public List<GoalResponse> getAllGoals(Long userId) {
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return goals.stream()
            .map(goal -> mapToResponse(goal, userId))
            .collect(Collectors.toList());
    }
    
    public GoalResponse getGoal(Long userId, Long goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        return mapToResponse(goal, userId);
    }
    
    @Transactional
    public GoalResponse updateGoal(Long userId, Long goalId, GoalRequest request) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        
        if (request.getTargetAmount() != null) {
            goal.setTargetAmount(request.getTargetAmount());
        }
        
        if (request.getTargetDate() != null) {
            LocalDate targetDate = LocalDate.parse(request.getTargetDate());
            if (!targetDate.isAfter(LocalDate.now())) {
                throw new BadRequestException("Target date must be a future date");
            }
            goal.setTargetDate(targetDate);
        }
        
        Goal updated = goalRepository.save(goal);
        return mapToResponse(updated, userId);
    }
    
    @Transactional
    public void deleteGoal(Long userId, Long goalId) {
        Goal goal = goalRepository.findByIdAndUserId(goalId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        
        goalRepository.delete(goal);
    }
    
    private GoalResponse mapToResponse(Goal goal, Long userId) {
        // Calculate progress: Total Income - Total Expenses since goal start date
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateAfter(userId, goal.getStartDate());
        
        BigDecimal totalIncome = transactions.stream()
            .filter(t -> t.getType() == TransactionType.INCOME)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpenses = transactions.stream()
            .filter(t -> t.getType() == TransactionType.EXPENSE)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal currentProgress = totalIncome.subtract(totalExpenses);
        
        // Ensure progress doesn't exceed target for percentage calculation
        BigDecimal progressForCalc = currentProgress.min(goal.getTargetAmount());
        double progressPercentage = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0 
            ? progressForCalc.multiply(BigDecimal.valueOf(100)).divide(goal.getTargetAmount(), 2, RoundingMode.HALF_UP).doubleValue()
            : 0.0;
        
        BigDecimal remainingAmount = goal.getTargetAmount().subtract(currentProgress);
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO;
        }
        
        return new GoalResponse(
            goal.getId(),
            goal.getGoalName(),
            goal.getTargetAmount(),
            goal.getTargetDate().toString(),
            goal.getStartDate().toString(),
            currentProgress,
            progressPercentage,
            remainingAmount
        );
    }
}
