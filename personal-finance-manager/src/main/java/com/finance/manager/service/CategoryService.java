package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.*;
import com.finance.manager.exception.BadRequestException;
import com.finance.manager.exception.ConflictException;
import com.finance.manager.exception.ForbiddenException;
import com.finance.manager.exception.ResourceNotFoundException;
import com.finance.manager.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    private static final List<Category> DEFAULT_CATEGORIES = Arrays.asList(
        new Category("Salary", TransactionType.INCOME, false, null),
        new Category("Food", TransactionType.EXPENSE, false, null),
        new Category("Rent", TransactionType.EXPENSE, false, null),
        new Category("Transportation", TransactionType.EXPENSE, false, null),
        new Category("Entertainment", TransactionType.EXPENSE, false, null),
        new Category("Healthcare", TransactionType.EXPENSE, false, null),
        new Category("Utilities", TransactionType.EXPENSE, false, null)
    );
    
    public CategoryService(CategoryRepository categoryRepository,
                         TransactionRepository transactionRepository,
                         UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    
    @PostConstruct
    public void initDefaultCategories() {
        for (Category defaultCat : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByNameAndIsCustomFalse(defaultCat.getName())) {
                categoryRepository.save(defaultCat);
            }
        }
    }
    
    public List<CategoryResponse> getAllCategories(Long userId) {
        List<Category> defaultCategories = categoryRepository.findByIsCustomFalse();
        List<Category> userCategories = categoryRepository.findByUserId(userId);
        
        return Stream.concat(defaultCategories.stream(), userCategories.stream())
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public CategoryResponse createCategory(Long userId, CategoryRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (categoryRepository.existsByNameAndUserId(request.getName(), userId) ||
            categoryRepository.existsByNameAndIsCustomFalse(request.getName())) {
            throw new ConflictException("Category already exists");
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setType(request.getType());
        category.setCustom(true);
        category.setUser(user);
        
        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }
    
    @Transactional
    public void deleteCategory(Long userId, String name) {
        Category category = categoryRepository.findByNameAndUserId(name, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        if (!category.isCustom()) {
            throw new ForbiddenException("Cannot delete default categories");
        }
        
        if (transactionRepository.isCategoryUsedInTransactions(name, userId)) {
            throw new BadRequestException("Category is referenced by transactions and cannot be deleted");
        }
        
        categoryRepository.delete(category);
    }
    
    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
            category.getName(),
            category.getType(),
            category.isCustom()
        );
    }
}
