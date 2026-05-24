package com.finance.manager.dto;

import com.finance.manager.entity.TransactionType;
import java.math.BigDecimal;

public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String date;
    private String category;
    private String description;
    private TransactionType type;
    
    public TransactionResponse(Long id, BigDecimal amount, String date, String category, 
                               String description, TransactionType type) {
        this.id = id;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.description = description;
        this.type = type;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
}
