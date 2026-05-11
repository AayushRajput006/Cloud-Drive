package com.clouddrive.repository;

import com.clouddrive.entity.TrashItem;
import com.clouddrive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrashItemRepository extends JpaRepository<TrashItem, Long> {

    // Find trash items by user
    @Query("SELECT ti FROM TrashItem ti WHERE ti.user = :user ORDER BY ti.deletedAt DESC")
    List<TrashItem> findByUserOrderByDeletedAtDesc(@Param("user") User user);
    
    // Find expired trash items (to be permanently deleted)
    @Query("SELECT ti FROM TrashItem ti WHERE ti.autoDeleteAt IS NOT NULL AND ti.autoDeleteAt < :now")
    List<TrashItem> findExpiredTrashItems(@Param("now") LocalDateTime now);
    
    // Find trash item by id and user
    @Query("SELECT ti FROM TrashItem ti WHERE ti.id = :id AND ti.user = :user")
    TrashItem findByIdAndUser(@Param("id") Long id, @Param("user") User user);
    
    // Find trash item by id and user (returns Optional)
    @Query("SELECT ti FROM TrashItem ti WHERE ti.id = :id AND ti.user = :user")
    Optional<TrashItem> findByIdAndUserOptional(@Param("id") Long id, @Param("user") User user);
}
