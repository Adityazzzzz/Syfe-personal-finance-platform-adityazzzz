package com.finance.manager.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
public class Goal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String goalName;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal targetAmount;
    
    @Column(nullable = false)
    private LocalDate targetDate;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (startDate == null) {
            startDate = LocalDate.now();
        }
    }
    
    public Goal() {}
    
    public Goal(String goalName, BigDecimal targetAmount, LocalDate targetDate, 
                LocalDate startDate, User user) {
        this.goalName = goalName;
        this.targetAmount = targetAmount;
        this.targetDate = targetDate;
        this.startDate = startDate != null ? startDate : LocalDate.now();
        this.user = user;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getGoalName() { return goalName; }
    public void setGoalName(String goalName) { this.goalName = goalName; }
    
    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    
    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
}
