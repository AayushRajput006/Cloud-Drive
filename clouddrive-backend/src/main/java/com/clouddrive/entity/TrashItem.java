package com.clouddrive.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "trash_items")
public class TrashItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private FileItem file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Column(name = "original_name", nullable = false)
    private String originalName;

    @Column(name = "original_path", nullable = false)
    private String originalPath;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime deletedAt;

    @Column(name = "auto_delete_at")
    private LocalDateTime autoDeleteAt;

    // Default constructor
    public TrashItem() {}

    // Constructor with parameters
    public TrashItem(User user, FileItem file, String originalName, String originalPath) {
        this.user = user;
        this.file = file;
        this.originalName = originalName;
        this.originalPath = originalPath;
    }

    // Constructor with folder
    public TrashItem(User user, Folder folder, String originalName, String originalPath) {
        this.user = user;
        this.folder = folder;
        this.originalName = originalName;
        this.originalPath = originalPath;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FileItem getFile() { return file; }
    public void setFile(FileItem file) { this.file = file; }

    public Folder getFolder() { return folder; }
    public void setFolder(Folder folder) { this.folder = folder; }

    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }

    public String getOriginalPath() { return originalPath; }
    public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public LocalDateTime getAutoDeleteAt() { return autoDeleteAt; }
    public void setAutoDeleteAt(LocalDateTime autoDeleteAt) { this.autoDeleteAt = autoDeleteAt; }
}
