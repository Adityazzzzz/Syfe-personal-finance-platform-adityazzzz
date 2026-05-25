package com.finance.manager.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class GoalUpdateRequest {

    private String goalName;

    @Positive(message = "Target amount must be positive")
    private BigDecimal targetAmount;

    @Pattern(regexp = "(^$)|(^\\d{4}-\\d{2}-\\d{2}$)", message = "Target date must be in YYYY-MM-DD format")
    private String targetDate;

    @Pattern(regexp = "(^$)|(^\\d{4}-\\d{2}-\\d{2}$)", message = "Start date must be in YYYY-MM-DD format")
    private String startDate;

    public String getGoalName() { return goalName; }
    public void setGoalName(String goalName) { this.goalName = goalName; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public String getTargetDate() { return targetDate; }
    public void setTargetDate(String targetDate) { this.targetDate = targetDate; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
}
