package com.clouddrive.repository;

import com.clouddrive.entity.Folder;
import com.clouddrive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    // Find folders by owner
    List<Folder> findByOwnerAndIsTrashedFalse(User owner);
    
    // Find folders by owner and parent folder
    List<Folder> findByOwnerAndParentFolderAndIsTrashedFalse(User owner, Folder parentFolder);
    
    // Find root folders (parent is null)
    List<Folder> findByOwnerAndParentFolderIsNullAndIsTrashedFalse(User owner);
    
    // Find starred folders
    List<Folder> findByOwnerAndIsStarredTrueAndIsTrashedFalse(User owner);
    
    // Find folders by name search
    @Query("SELECT f FROM Folder f WHERE f.owner = :owner AND f.isTrashed = false AND LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Folder> findByOwnerAndNameContainingIgnoreCaseAndIsTrashedFalse(@Param("owner") User owner, @Param("searchTerm") String searchTerm);
    
    // Find folder by id and owner
    Optional<Folder> findByIdAndOwner(Long id, User owner);
    
    // Find recently created folders
    @Query("SELECT f FROM Folder f WHERE f.owner = :owner AND f.isTrashed = false ORDER BY f.createdAt DESC")
    List<Folder> findRecentFoldersByOwner(@Param("owner") User owner);
    
    // Find folders shared with user
    @Query("SELECT f FROM Folder f JOIN f.sharedWithUsers u WHERE u = :user AND f.isTrashed = false")
    List<Folder> findFoldersSharedWithUser(@Param("user") User user);
    
    // Legacy methods for backward compatibility
    @Query("SELECT f FROM Folder f WHERE f.owner.id = :userId ORDER BY f.createdAt DESC")
    List<Folder> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT f FROM Folder f WHERE f.id = :id AND f.owner.id = :userId")
    Optional<Folder> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
