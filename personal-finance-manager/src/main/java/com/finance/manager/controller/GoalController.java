package com.finance.manager.controller;

import com.finance.manager.dto.*;
import com.finance.manager.service.GoalService;
import com.finance.manager.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    
    private final GoalService goalService;
    private final UserService userService;
    
    public GoalController(GoalService goalService, UserService userService) {
        this.goalService = goalService;
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @Valid @RequestBody GoalRequest request,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        GoalResponse response = goalService.createGoal(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<GoalListResponse> getGoals(HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(new GoalListResponse(goalService.getAllGoals(userId)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoal(
            @PathVariable Long id,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(goalService.getGoal(userId, id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(goalService.updateGoal(userId, id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteGoal(
            @PathVariable Long id,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        goalService.deleteGoal(userId, id);
        return ResponseEntity.ok(new MessageResponse("Goal deleted successfully"));
    }
}
