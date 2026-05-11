package com.clouddrive.repository;

import com.clouddrive.entity.StarredItem;
import com.clouddrive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StarredItemRepository extends JpaRepository<StarredItem, Long> {

    // Find starred items by user
    @Query("SELECT si FROM StarredItem si WHERE si.user = :user ORDER BY si.createdAt DESC")
    List<StarredItem> findByUserOrderByCreatedAtDesc(@Param("user") User user);
    
    // Find starred files by user
    @Query("SELECT si FROM StarredItem si WHERE si.user = :user AND si.file IS NOT NULL ORDER BY si.createdAt DESC")
    List<StarredItem> findStarredFilesByUser(@Param("user") User user);
    
    // Find starred folders by user
    @Query("SELECT si FROM StarredItem si WHERE si.user = :user AND si.folder IS NOT NULL ORDER BY si.createdAt DESC")
    List<StarredItem> findStarredFoldersByUser(@Param("user") User user);
    
    // Check if file is starred by user
    @Query("SELECT COUNT(si) > 0 FROM StarredItem si WHERE si.user = :user AND si.file = :file")
    boolean existsByUserAndFile(@Param("user") User user, @Param("file") com.clouddrive.entity.FileItem file);
    
    // Check if folder is starred by user
    @Query("SELECT COUNT(si) > 0 FROM StarredItem si WHERE si.user = :user AND si.folder = :folder")
    boolean existsByUserAndFolder(@Param("user") User user, @Param("folder") com.clouddrive.entity.Folder folder);
    
    // Find starred item by user and file
    @Query("SELECT si FROM StarredItem si WHERE si.user = :user AND si.file = :file")
    Optional<StarredItem> findByUserAndFile(@Param("user") User user, @Param("file") com.clouddrive.entity.FileItem file);
}
