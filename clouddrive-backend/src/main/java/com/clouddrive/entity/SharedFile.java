package com.clouddrive.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "shared_files")
public class SharedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private FileItem file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by_user_id", nullable = false)
    private User sharedByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id")
    private User sharedWithUser;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PermissionType permission;

    @Column(nullable = false)
    private Boolean isPublic = false;

    @Column(name = "share_token")
    private String shareToken;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // Default constructor
    public SharedFile() {}

    // Constructor with parameters
    public SharedFile(FileItem file, User sharedByUser, User sharedWithUser, PermissionType permission) {
        this.file = file;
        this.sharedByUser = sharedByUser;
        this.sharedWithUser = sharedWithUser;
        this.permission = permission;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FileItem getFile() { return file; }
    public void setFile(FileItem file) { this.file = file; }

    public User getSharedByUser() { return sharedByUser; }
    public void setSharedByUser(User sharedByUser) { this.sharedByUser = sharedByUser; }

    public User getSharedWithUser() { return sharedWithUser; }
    public void setSharedWithUser(User sharedWithUser) { this.sharedWithUser = sharedWithUser; }

    public PermissionType getPermission() { return permission; }
    public void setPermission(PermissionType permission) { this.permission = permission; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean publicShare) { this.isPublic = publicShare; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
