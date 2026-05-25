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
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    
    public TransactionService(TransactionRepository transactionRepository, 
                              UserRepository userRepository,
                              CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }
    
    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LocalDate date = LocalDate.parse(request.getDate());
        if (date.isAfter(LocalDate.now())) {
            throw new BadRequestException("Date cannot be in the future");
        }
        
        Category category = categoryRepository.findByNameAndUserIdOrDefault(request.getCategory(), userId)
            .orElseThrow(() -> new BadRequestException("Invalid category: " + request.getCategory()));
        
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setDate(date);
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setType(category.getType());
        transaction.setUser(user);
        
        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }
    
    public List<TransactionResponse> getTransactions(Long userId, String startDate, String endDate, String category) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        
        List<Transaction> transactions;
        
        if (start != null && end != null && category != null) {
            transactions = transactionRepository.findByUserIdAndDateBetweenAndCategoryOrderByDateDesc(userId, start, end, category);
        } else if (start != null && end != null) {
            transactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);
        } else if (category != null) {
            transactions = transactionRepository.findByUserIdAndCategoryOrderByDateDesc(userId, category);
        } else {
            transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
        }
        
        return transactions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionUpdateRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
        
        if (request == null) {
            return mapToResponse(transaction);
        }

        boolean hasUpdates = false;

        if (request.getAmount() != null) {
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Amount must be positive");
            }
            transaction.setAmount(request.getAmount());
            hasUpdates = true;
        }

        if (request.getDescription() != null) {
            transaction.setDescription(request.getDescription());
            hasUpdates = true;
        }

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            Category category = categoryRepository.findByNameAndUserIdOrDefault(request.getCategory(), userId)
                .orElseThrow(() -> new BadRequestException("Invalid category: " + request.getCategory()));
            transaction.setCategory(request.getCategory());
            transaction.setType(category.getType());
            hasUpdates = true;
        } else if (request.getCategory() != null && request.getCategory().isBlank()) {
            throw new BadRequestException("Category is required");
        }

        if (!hasUpdates) {
            return mapToResponse(transaction);
        }

        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }
    
    @Transactional
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
        
        transactionRepository.delete(transaction);
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getDate().toString(),
            transaction.getCategory(),
            transaction.getDescription(),
            transaction.getType()
        );
    }
}
