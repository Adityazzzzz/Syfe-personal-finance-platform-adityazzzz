package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.User;
import com.finance.manager.exception.ConflictException;
import com.finance.manager.exception.UnauthorizedException;
import com.finance.manager.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public UserRegisterResponse registerUser(UserRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        
        User savedUser = userRepository.save(user);
        return new UserRegisterResponse("User registered successfully", savedUser.getId());
    }
    
    public MessageResponse login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        
        return new MessageResponse("Login successful");
    }
    
    public MessageResponse logout(HttpSession session) {
        session.invalidate();
        return new MessageResponse("Logout successful");
    }
    
    public User getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        return userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
    
    public Long getCurrentUserId(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        return userId;
    }
}
