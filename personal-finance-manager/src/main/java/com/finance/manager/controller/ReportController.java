package com.finance.manager.controller;

import com.finance.manager.dto.*;
import com.finance.manager.service.ReportService;
import com.finance.manager.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    private final ReportService reportService;
    private final UserService userService;
    
    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }
    
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<MonthlyReportResponse> getMonthlyReport(
            @PathVariable int year,
            @PathVariable int month,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(reportService.getMonthlyReport(userId, year, month));
    }
    
    @GetMapping("/yearly/{year}")
    public ResponseEntity<YearlyReportResponse> getYearlyReport(
            @PathVariable int year,
            HttpSession session) {
        Long userId = userService.getCurrentUserId(session);
        return ResponseEntity.ok(reportService.getYearlyReport(userId, year));
    }
}
