package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.ResourceNotFoundException;
import com.finance.manager.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private ReportService reportService;
    
    @BeforeEach
    void setUp() {
    }
    
    @Test
    void getMonthlyReport_Success() {
        when(userRepository.existsById(anyLong())).thenReturn(true);
        
        List<Object[]> incomeData = Arrays.<Object[]>asList(
            new Object[]{"Salary", new BigDecimal("5000.00")},
            new Object[]{"Freelance", new BigDecimal("1000.00")}
        );
        
        List<Object[]> expenseData = Arrays.<Object[]>asList(
            new Object[]{"Food", new BigDecimal("400.00")},
            new Object[]{"Rent", new BigDecimal("1200.00")}
        );
        
        when(transactionRepository.sumByCategoryAndTypeAndDateBetween(
            eq(1L), eq(TransactionType.INCOME), any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(incomeData);
        when(transactionRepository.sumByCategoryAndTypeAndDateBetween(
            eq(1L), eq(TransactionType.EXPENSE), any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(expenseData);
        
        MonthlyReportResponse response = reportService.getMonthlyReport(1L, 2024, 1);
        
        assertNotNull(response);
        assertEquals(2024, response.getYear());
        assertEquals(1, response.getMonth());
        assertEquals(new BigDecimal("6000.00"), response.getTotalIncome().get("Salary").add(response.getTotalIncome().get("Freelance")));
        assertEquals(new BigDecimal("1600.00"), response.getTotalExpenses().get("Food").add(response.getTotalExpenses().get("Rent")));
        assertEquals(new BigDecimal("4400.00"), response.getNetSavings());
    }
    
    @Test
    void getYearlyReport_Success() {
        when(userRepository.existsById(anyLong())).thenReturn(true);
        
        List<Object[]> incomeData = Arrays.<Object[]>asList(
            new Object[]{"Salary", new BigDecimal("60000.00")}
        );
        
        List<Object[]> expenseData = Arrays.<Object[]>asList(
            new Object[]{"Rent", new BigDecimal("14400.00")},
            new Object[]{"Food", new BigDecimal("4800.00")}
        );
        
        when(transactionRepository.sumByCategoryAndTypeAndDateBetween(
            eq(1L), eq(TransactionType.INCOME), any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(incomeData);
        when(transactionRepository.sumByCategoryAndTypeAndDateBetween(
            eq(1L), eq(TransactionType.EXPENSE), any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(expenseData);
        
        YearlyReportResponse response = reportService.getYearlyReport(1L, 2024);
        
        assertNotNull(response);
        assertEquals(2024, response.getYear());
        assertEquals(new BigDecimal("60000.00"), response.getTotalIncome().get("Salary"));
        assertEquals(new BigDecimal("40800.00"), response.getNetSavings());
    }
    
    @Test
    void getMonthlyReport_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.existsById(anyLong())).thenReturn(false);
        
        assertThrows(ResourceNotFoundException.class, () -> reportService.getMonthlyReport(999L, 2024, 1));
    }
}
