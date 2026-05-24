package com.finance.manager.controller;

import com.finance.manager.dto.*;
import com.finance.manager.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    
    private MockMvc mockMvc;
    
    @Mock
    private UserService userService;
    
    @InjectMocks
    private AuthController authController;
    
    private ObjectMapper objectMapper;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }
    
    @Test
    void register_Success() throws Exception {
        UserRegisterRequest request = new UserRegisterRequest();
        request.setUsername("test@example.com");
        request.setPassword("password123");
        request.setFullName("Test User");
        
        UserRegisterResponse response = new UserRegisterResponse("User registered successfully", 1L);
        
        when(userService.registerUser(any(UserRegisterRequest.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.message").value("User registered successfully"))
            .andExpect(jsonPath("$.userId").value(1));
    }
    
    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("test@example.com");
        request.setPassword("password123");
        
        MessageResponse response = new MessageResponse("Login successful");
        
        when(userService.login(any(LoginRequest.class), any(HttpSession.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Login successful"));
    }
    
    @Test
    void logout_Success() throws Exception {
        MessageResponse response = new MessageResponse("Logout successful");
        
        when(userService.logout(any(HttpSession.class))).thenReturn(response);
        
        mockMvc.perform(post("/api/auth/logout"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Logout successful"));
    }
}
