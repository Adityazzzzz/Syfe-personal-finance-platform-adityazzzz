package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.BadRequestException;
import com.finance.manager.exception.ConflictException;
import com.finance.manager.exception.ForbiddenException;
import com.finance.manager.exception.ResourceNotFoundException;
import com.finance.manager.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private CategoryService categoryService;
    
    private User testUser;
    private Category defaultCategory;
    private Category customCategory;
    private CategoryRequest request;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("test@example.com");
        
        defaultCategory = new Category("Salary", TransactionType.INCOME, false, null);
        
        customCategory = new Category("Custom", TransactionType.EXPENSE, true, testUser);
        customCategory.setId(1L);
        
        request = new CategoryRequest();
        request.setName("NewCategory");
        request.setType(TransactionType.EXPENSE);
    }
    
    @Test
    void getAllCategories_Success() {
        when(categoryRepository.findByIsCustomFalse()).thenReturn(Arrays.asList(defaultCategory));
        when(categoryRepository.findByUserId(anyLong())).thenReturn(Arrays.asList(customCategory));
        
        List<CategoryResponse> responses = categoryService.getAllCategories(1L);
        
        assertNotNull(responses);
        assertEquals(2, responses.size());
    }
    
    @Test
    void createCategory_Success() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(categoryRepository.existsByNameAndUserId(anyString(), anyLong())).thenReturn(false);
        when(categoryRepository.existsByNameAndIsCustomFalse(anyString())).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(customCategory);
        
        CategoryResponse response = categoryService.createCategory(1L, request);
        
        assertNotNull(response);
        assertTrue(response.isCustom());
    }
    
    @Test
    void createCategory_DuplicateName_ThrowsConflictException() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(categoryRepository.existsByNameAndUserId(anyString(), anyLong())).thenReturn(true);
        
        assertThrows(ConflictException.class, () -> categoryService.createCategory(1L, request));
    }
    
    @Test
    void deleteCategory_NotCustom_ThrowsForbiddenException() {
        when(categoryRepository.findByNameAndUserId(anyString(), anyLong())).thenReturn(Optional.of(defaultCategory));
        
        assertThrows(ForbiddenException.class, () -> categoryService.deleteCategory(1L, "Salary"));
    }
    
    @Test
    void deleteCategory_ReferencedByTransactions_ThrowsBadRequestException() {
        when(categoryRepository.findByNameAndUserId(anyString(), anyLong())).thenReturn(Optional.of(customCategory));
        when(transactionRepository.isCategoryUsedInTransactions(anyString(), anyLong())).thenReturn(true);
        
        assertThrows(BadRequestException.class, () -> categoryService.deleteCategory(1L, "Custom"));
    }
}
