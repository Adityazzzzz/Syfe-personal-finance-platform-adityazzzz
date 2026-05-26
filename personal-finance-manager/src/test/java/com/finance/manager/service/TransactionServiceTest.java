package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.BadRequestException;
import com.finance.manager.exception.ForbiddenException;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @InjectMocks
    private TransactionService transactionService;
    
    private User testUser;
    private Category testCategory;
    private Transaction testTransaction;
    private TransactionRequest request;
    private TransactionUpdateRequest updateRequest;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("test@example.com");
        
        testCategory = new Category();
        testCategory.setName("Salary");
        testCategory.setType(TransactionType.INCOME);
        testCategory.setCustom(false);
        
        testTransaction = new Transaction();
        testTransaction.setId(1L);
        testTransaction.setAmount(new BigDecimal("5000.00"));
        testTransaction.setDate(LocalDate.now());
        testTransaction.setCategory("Salary");
        testTransaction.setDescription("Monthly salary");
        testTransaction.setType(TransactionType.INCOME);
        testTransaction.setUser(testUser);
        
        request = new TransactionRequest();
        request.setAmount(new BigDecimal("5000.00"));
        request.setDate(LocalDate.now().toString());
        request.setCategory("Salary");
        request.setDescription("Monthly salary");

        updateRequest = new TransactionUpdateRequest();
        updateRequest.setAmount(new BigDecimal("5000.00"));
        updateRequest.setCategory("Salary");
        updateRequest.setDescription("Monthly salary");
    }
    
    @Test
    void createTransaction_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(categoryRepository.findByNameAndUserIdOrDefault(anyString(), anyLong())).thenReturn(Optional.of(testCategory));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(testTransaction);
        
        TransactionResponse response = transactionService.createTransaction(1L, request);
        
        assertNotNull(response);
        assertEquals(new BigDecimal("5000.00"), response.getAmount());
        assertEquals("Salary", response.getCategory());
        assertEquals(TransactionType.INCOME, response.getType());
    }
    
    @Test
    void createTransaction_FutureDate_ThrowsBadRequestException() {
        request.setDate(LocalDate.now().plusDays(1).toString());
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        
        assertThrows(BadRequestException.class, () -> transactionService.createTransaction(1L, request));
    }
    
    @Test
    void getTransactions_Success() {
        when(transactionRepository.findByUserIdOrderByDateDesc(anyLong()))
            .thenReturn(Arrays.asList(testTransaction));
        
        List<TransactionResponse> responses = transactionService.getTransactions(1L, null, null, null);
        
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Salary", responses.get(0).getCategory());
    }
    
    @Test
    void updateTransaction_NotOwner_ThrowsForbiddenException() {
        User otherUser = new User();
        otherUser.setId(2L);
        testTransaction.setUser(otherUser);
        
        when(transactionRepository.findById(anyLong())).thenReturn(Optional.of(testTransaction));
        
        assertThrows(ForbiddenException.class, () -> transactionService.updateTransaction(1L, 1L, updateRequest));
    }
    
    @Test
    void deleteTransaction_Success() {
        when(transactionRepository.findById(anyLong())).thenReturn(Optional.of(testTransaction));
        
        assertDoesNotThrow(() -> transactionService.deleteTransaction(1L, 1L));
        verify(transactionRepository).delete(testTransaction);
    }
}
