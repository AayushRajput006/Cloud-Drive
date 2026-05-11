package com.clouddrive.repository;

import com.clouddrive.entity.FileEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUserIdOrderByUploadDateDesc(Long userId);

    Optional<FileEntity> findByIdAndUserId(Long id, Long userId);

    @Query("""
            SELECT f FROM FileEntity f
            WHERE f.user.id = :userId
              AND (
                LOWER(f.fileName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(f.fileType) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            ORDER BY f.uploadDate DESC
            """)
    List<FileEntity> searchByUserAndQuery(@Param("userId") Long userId, @Param("query") String query);
}
