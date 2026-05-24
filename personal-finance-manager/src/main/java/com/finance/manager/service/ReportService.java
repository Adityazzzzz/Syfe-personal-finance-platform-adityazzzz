package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.ResourceNotFoundException;
import com.finance.manager.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    public ReportService(TransactionRepository transactionRepository,
                         UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    
    public MonthlyReportResponse getMonthlyReport(Long userId, int year, int month) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        Map<String, BigDecimal> totalIncome = getCategoryTotals(userId, TransactionType.INCOME, startDate, endDate);
        Map<String, BigDecimal> totalExpenses = getCategoryTotals(userId, TransactionType.EXPENSE, startDate, endDate);
        
        BigDecimal incomeSum = totalIncome.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenseSum = totalExpenses.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netSavings = incomeSum.subtract(expenseSum);
        
        return new MonthlyReportResponse(month, year, totalIncome, totalExpenses, netSavings);
    }
    
    public YearlyReportResponse getYearlyReport(Long userId, int year) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        Map<String, BigDecimal> totalIncome = getCategoryTotals(userId, TransactionType.INCOME, startDate, endDate);
        Map<String, BigDecimal> totalExpenses = getCategoryTotals(userId, TransactionType.EXPENSE, startDate, endDate);
        
        BigDecimal incomeSum = totalIncome.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenseSum = totalExpenses.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netSavings = incomeSum.subtract(expenseSum);
        
        return new YearlyReportResponse(year, totalIncome, totalExpenses, netSavings);
    }
    
    private Map<String, BigDecimal> getCategoryTotals(Long userId, TransactionType type, 
                                                        LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> result = new HashMap<>();
        
        List<Object[]> totals = transactionRepository.sumByCategoryAndTypeAndDateBetween(
            userId, type, startDate, endDate);
        
        for (Object[] row : totals) {
            String category = (String) row[0];
            BigDecimal amount = row[1] != null ? 
                new BigDecimal(row[1].toString()).setScale(2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
            result.put(category, amount);
        }
        
        return result;
    }
}
