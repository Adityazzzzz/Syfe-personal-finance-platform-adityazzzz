package com.finance.manager.repository;

import com.finance.manager.entity.Transaction;
import com.finance.manager.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);
    
    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndCategoryOrderByDateDesc(Long userId, String category);
    
    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, TransactionType type);
    
    List<Transaction> findByUserIdAndDateBetweenAndCategoryOrderByDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate, String category);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.date >= :startDate ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndDateAfter(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :startDate AND :endDate GROUP BY t.category")
    List<Object[]> sumByCategoryAndTypeAndDateBetween(@Param("userId") Long userId, @Param("type") TransactionType type, 
                                                       @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    Double sumAmountByTypeAndDateBetween(@Param("userId") Long userId, @Param("type") TransactionType type, 
                                          @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(t) > 0 FROM Transaction t WHERE t.user.id = :userId AND t.category = :category")
    boolean isCategoryUsedInTransactions(@Param("category") String category, @Param("userId") Long userId);
}
