package com.clouddrive.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "profile_image_path")
    private String profileImagePath;

    @Column(name = "storage_quota")
    private Long storageQuota = 21474836480L; // 20GB in bytes

    @Column(name = "storage_used")
    private Long storageUsed = 0L;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    @Column(name = "failed_attempts")
    private int failedAttempts = 0;

    @Column(name = "last_otp_sent_at")
    private LocalDateTime lastOtpSentAt;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FileItem> files = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Folder> folders = new HashSet<>();

    @OneToMany(mappedBy = "sharedByUser", cascade = CascadeType.ALL)
    private Set<SharedFile> sharedFiles = new HashSet<>();

    @OneToMany(mappedBy = "sharedWithUser", cascade = CascadeType.ALL)
    private Set<SharedFile> filesSharedWithMe = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<StarredItem> starredItems = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<TrashItem> trashItems = new HashSet<>();

    // Default constructor
    public User() {}

    // Constructor with parameters
    public User(String name, String email, String password, LocalDateTime createdAt) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }

    public Long getStorageQuota() { return storageQuota; }
    public void setStorageQuota(Long storageQuota) { this.storageQuota = storageQuota; }

    public Long getStorageUsed() { return storageUsed; }
    public void setStorageUsed(Long storageUsed) { this.storageUsed = storageUsed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<FileItem> getFiles() { return files; }
    public void setFiles(Set<FileItem> files) { this.files = files; }

    public Set<Folder> getFolders() { return folders; }
    public void setFolders(Set<Folder> folders) { this.folders = folders; }

    public Set<SharedFile> getSharedFiles() { return sharedFiles; }
    public void setSharedFiles(Set<SharedFile> sharedFiles) { this.sharedFiles = sharedFiles; }

    public Set<SharedFile> getFilesSharedWithMe() { return filesSharedWithMe; }
    public void setFilesSharedWithMe(Set<SharedFile> filesSharedWithMe) { this.filesSharedWithMe = filesSharedWithMe; }

    public Set<StarredItem> getStarredItems() { return starredItems; }
    public void setStarredItems(Set<StarredItem> starredItems) { this.starredItems = starredItems; }

    public Set<TrashItem> getTrashItems() { return trashItems; }
    public void setTrashItems(Set<TrashItem> trashItems) { this.trashItems = trashItems; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }

    public int getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }

    public LocalDateTime getLastOtpSentAt() { return lastOtpSentAt; }
    public void setLastOtpSentAt(LocalDateTime lastOtpSentAt) { this.lastOtpSentAt = lastOtpSentAt; }
}
