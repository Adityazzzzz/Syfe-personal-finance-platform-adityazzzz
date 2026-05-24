package com.finance.manager.service;

import com.finance.manager.dto.*;
import com.finance.manager.entity.User;
import com.finance.manager.exception.ConflictException;
import com.finance.manager.exception.UnauthorizedException;
import com.finance.manager.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private HttpSession session;
    
    @InjectMocks
    private UserService userService;
    
    private User testUser;
    private UserRegisterRequest registerRequest;
    private LoginRequest loginRequest;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setFullName("Test User");
        testUser.setPhoneNumber("+1234567890");
        
        registerRequest = new UserRegisterRequest();
        registerRequest.setUsername("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");
        registerRequest.setPhoneNumber("+1234567890");
        
        loginRequest = new LoginRequest();
        loginRequest.setUsername("test@example.com");
        loginRequest.setPassword("password123");
    }
    
    @Test
    void registerUser_Success() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        UserRegisterResponse response = userService.registerUser(registerRequest);
        
        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertEquals(1L, response.getUserId());
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void registerUser_UsernameExists_ThrowsConflictException() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        
        assertThrows(ConflictException.class, () -> userService.registerUser(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void login_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        
        MessageResponse response = userService.login(loginRequest, session);
        
        assertEquals("Login successful", response.getMessage());
        verify(session).setAttribute("userId", 1L);
        verify(session).setAttribute("username", "test@example.com");
    }
    
    @Test
    void login_InvalidCredentials_ThrowsUnauthorizedException() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
        
        assertThrows(UnauthorizedException.class, () -> userService.login(loginRequest, session));
    }
    
    @Test
    void getCurrentUser_Success() {
        when(session.getAttribute("userId")).thenReturn(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        User result = userService.getCurrentUser(session);
        
        assertNotNull(result);
        assertEquals("test@example.com", result.getUsername());
    }
    
    @Test
    void getCurrentUser_NotAuthenticated_ThrowsUnauthorizedException() {
        when(session.getAttribute("userId")).thenReturn(null);
        
        assertThrows(UnauthorizedException.class, () -> userService.getCurrentUser(session));
    }
}
