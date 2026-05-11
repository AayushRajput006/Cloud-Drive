package com.clouddrive.repository;

import com.clouddrive.entity.FileItem;
import com.clouddrive.entity.User;
import com.clouddrive.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileItemRepository extends JpaRepository<FileItem, Long> {

    // Find files by owner
    List<FileItem> findByOwnerAndIsTrashedFalse(User owner);
    
    // Find files by owner and folder
    List<FileItem> findByOwnerAndParentFolderAndIsTrashedFalse(User owner, Folder parentFolder);
    
    // Find files by owner and parent folder (null for root)
    List<FileItem> findByOwnerAndParentFolderIsNullAndIsTrashedFalse(User owner);
    
    // Find starred files
    List<FileItem> findByOwnerAndIsStarredTrueAndIsTrashedFalse(User owner);
    
    // Find files by name search
    @Query("SELECT f FROM FileItem f WHERE f.owner = :owner AND f.isTrashed = false AND LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<FileItem> findByOwnerAndNameContainingIgnoreCaseAndIsTrashedFalse(@Param("owner") User owner, @Param("searchTerm") String searchTerm);
    
    // Find files by type
    List<FileItem> findByOwnerAndTypeAndIsTrashedFalse(User owner, String type);
    
    // Find file by id and owner
    Optional<FileItem> findByIdAndOwner(Long id, User owner);
    
    // Count files by owner
    long countByOwnerAndIsTrashedFalse(User owner);
    
    // Get total storage used by user
    @Query("SELECT COALESCE(SUM(f.size), 0) FROM FileItem f WHERE f.owner = :owner AND f.isTrashed = false")
    Long getTotalStorageUsedByUser(@Param("owner") User owner);
    
    // Find recently uploaded files
    @Query("SELECT f FROM FileItem f WHERE f.owner = :owner AND f.isTrashed = false ORDER BY f.createdAt DESC")
    List<FileItem> findRecentFilesByOwner(@Param("owner") User owner);
    
    // Find files shared with user
    @Query("SELECT f FROM FileItem f JOIN f.sharedWithUsers u WHERE u = :user AND f.isTrashed = false")
    List<FileItem> findFilesSharedWithUser(@Param("user") User user);
}
