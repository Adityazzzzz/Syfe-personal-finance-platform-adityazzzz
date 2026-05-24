package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.BadRequestException;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {
    
    @Mock
    private GoalRepository goalRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @InjectMocks
    private GoalService goalService;
    
    private User testUser;
    private Goal testGoal;
    private GoalRequest request;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("test@example.com");
        
        testGoal = new Goal();
        testGoal.setId(1L);
        testGoal.setGoalName("Emergency Fund");
        testGoal.setTargetAmount(new BigDecimal("5000.00"));
        testGoal.setTargetDate(LocalDate.now().plusMonths(6));
        testGoal.setStartDate(LocalDate.now());
        testGoal.setUser(testUser);
        
        request = new GoalRequest();
        request.setGoalName("Emergency Fund");
        request.setTargetAmount(new BigDecimal("5000.00"));
        request.setTargetDate(LocalDate.now().plusMonths(6).toString());
    }
    
    @Test
    void createGoal_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(goalRepository.save(any(Goal.class))).thenReturn(testGoal);
        when(transactionRepository.findByUserIdAndDateAfter(anyLong(), any(LocalDate.class)))
            .thenReturn(Collections.emptyList());
        
        GoalResponse response = goalService.createGoal(1L, request);
        
        assertNotNull(response);
        assertEquals("Emergency Fund", response.getGoalName());
        assertEquals(new BigDecimal("5000.00"), response.getTargetAmount());
    }
    
    @Test
    void createGoal_PastTargetDate_ThrowsBadRequestException() {
        request.setTargetDate(LocalDate.now().minusDays(1).toString());
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        
        assertThrows(BadRequestException.class, () -> goalService.createGoal(1L, request));
    }
    
    @Test
    void getAllGoals_Success() {
        when(goalRepository.findByUserIdOrderByCreatedAtDesc(anyLong())).thenReturn(Arrays.asList(testGoal));
        when(transactionRepository.findByUserIdAndDateAfter(anyLong(), any(LocalDate.class)))
            .thenReturn(Collections.emptyList());
        
        List<GoalResponse> responses = goalService.getAllGoals(1L);
        
        assertNotNull(responses);
        assertEquals(1, responses.size());
    }
    
    @Test
    void getGoal_Success() {
        when(goalRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.of(testGoal));
        when(transactionRepository.findByUserIdAndDateAfter(anyLong(), any(LocalDate.class)))
            .thenReturn(Collections.emptyList());
        
        GoalResponse response = goalService.getGoal(1L, 1L);
        
        assertNotNull(response);
        assertEquals("Emergency Fund", response.getGoalName());
    }
    
    @Test
    void getGoal_NotFound_ThrowsResourceNotFoundException() {
        when(goalRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> goalService.getGoal(1L, 999L));
    }
    
    @Test
    void deleteGoal_Success() {
        when(goalRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.of(testGoal));
        
        assertDoesNotThrow(() -> goalService.deleteGoal(1L, 1L));
        verify(goalRepository).delete(testGoal);
    }
}
