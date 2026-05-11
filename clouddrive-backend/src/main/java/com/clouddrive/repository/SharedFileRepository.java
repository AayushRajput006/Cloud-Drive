package com.clouddrive.repository;

import com.clouddrive.entity.SharedFile;
import com.clouddrive.entity.User;
import com.clouddrive.entity.FileItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedFileRepository extends JpaRepository<SharedFile, Long> {

    // Find files shared by user
    @Query("SELECT sf FROM SharedFile sf WHERE sf.sharedByUser = :user ORDER BY sf.createdAt DESC")
    List<SharedFile> findBySharedByUser(@Param("user") User user);
    
    // Find files shared with user
    @Query("SELECT sf FROM SharedFile sf WHERE sf.sharedWithUser = :user ORDER BY sf.createdAt DESC")
    List<SharedFile> findBySharedWithUser(@Param("user") User user);
    
    // Find public shares
    @Query("SELECT sf FROM SharedFile sf WHERE sf.isPublic = true ORDER BY sf.createdAt DESC")
    List<SharedFile> findByIsPublicTrue();
    
    // Find share by token
    @Query("SELECT sf FROM SharedFile sf WHERE sf.shareToken = :token AND (sf.expiresAt IS NULL OR sf.expiresAt > CURRENT_TIMESTAMP)")
    SharedFile findByShareToken(@Param("token") String token);
    
    // Find expired shares
    @Query("SELECT sf FROM SharedFile sf WHERE sf.expiresAt IS NOT NULL AND sf.expiresAt < CURRENT_TIMESTAMP")
    List<SharedFile> findExpiredShares();
}
