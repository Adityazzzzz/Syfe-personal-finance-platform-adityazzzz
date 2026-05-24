package com.finance.manager.repository;

import com.finance.manager.entity.Category;
import com.finance.manager.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByIsCustomFalse();
    
    List<Category> findByUserId(Long userId);
    
    List<Category> findByUserIdOrIsCustomFalse(Long userId);
    
    Optional<Category> findByNameAndUserId(String name, Long userId);
    
    Optional<Category> findByNameAndIsCustomFalse(String name);
    
    boolean existsByNameAndUserId(String name, Long userId);
    
    boolean existsByNameAndIsCustomFalse(String name);
    
    @Query("SELECT c FROM Category c WHERE (c.user.id = :userId OR c.isCustom = false) AND c.name = :name")
    Optional<Category> findByNameAndUserIdOrDefault(@Param("name") String name, @Param("userId") Long userId);
    
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Transaction t WHERE t.category = :categoryName AND t.user.id = :userId")
    boolean isCategoryUsedInTransactions(@Param("categoryName") String categoryName, @Param("userId") Long userId);
    
    List<Category> findByType(TransactionType type);
}
