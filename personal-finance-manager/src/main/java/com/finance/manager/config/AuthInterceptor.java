package com.finance.manager.config;

import com.finance.manager.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        
        // Allow public endpoints
        if (path.equals("/api/auth/register") || path.equals("/api/auth/login") || 
            path.startsWith("/h2-console")) {
            return true;
        }
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        
        return true;
    }
}
