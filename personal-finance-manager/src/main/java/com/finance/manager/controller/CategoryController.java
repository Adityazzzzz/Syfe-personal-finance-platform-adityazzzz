package com.finance.manager.controller;

import com.finance.manager.dto.*;
import com.finance.manager.service.CategoryService;
import com.finance.manager.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryService categoryService;
    private final UserService userService;
    
    public CategoryController(CategoryService categoryService, UserService userService) {
        this.categoryService = categoryService;
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<CategoryListResponse> getCategories(HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(new CategoryListResponse(categoryService.getAllCategories(userId)));
    }
    
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        CategoryResponse response = categoryService.createCategory(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{name}")
    public ResponseEntity<MessageResponse> deleteCategory(
            @PathVariable String name,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        categoryService.deleteCategory(userId, name);
        return ResponseEntity.ok(new MessageResponse("Category deleted successfully"));
    }
}
