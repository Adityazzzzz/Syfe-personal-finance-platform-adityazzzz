package com.finance.manager.controller;

import com.finance.manager.dto.*;
import com.finance.manager.service.TransactionService;
import com.finance.manager.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    private final TransactionService transactionService;
    private final UserService userService;
    
    public TransactionController(TransactionService transactionService, UserService userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        TransactionResponse response = transactionService.createTransaction(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<TransactionListResponse> getTransactions(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String category,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        List<TransactionResponse> transactions = transactionService.getTransactions(userId, startDate, endDate, category);
        return ResponseEntity.ok(new TransactionListResponse(transactions));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionUpdateRequest request,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        TransactionResponse response = transactionService.updateTransaction(userId, id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTransaction(
            @PathVariable Long id,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.ok(new MessageResponse("Transaction deleted successfully"));
    }
}
