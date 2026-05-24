package com.clouddrive.service.impl;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.clouddrive.dto.FileUploadResponse;
import com.clouddrive.dto.MoveFileRequest;
import com.clouddrive.dto.ShareFileResponse;
import com.clouddrive.entity.FileItem;
import com.clouddrive.entity.Folder;
import com.clouddrive.entity.StarredItem;
import com.clouddrive.entity.TrashItem;
import com.clouddrive.entity.User;
import com.clouddrive.repository.FileItemRepository;
import com.clouddrive.repository.FolderRepository;
import com.clouddrive.repository.StarredItemRepository;
import com.clouddrive.repository.TrashItemRepository;
import com.clouddrive.repository.UserRepository;
import com.clouddrive.service.FileService;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class FileServiceImpl implements FileService {

    private final FileItemRepository fileRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;
    private final StarredItemRepository starredRepository;
    private final TrashItemRepository trashRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.presigned-url-expiration-minutes:30}")
    private long presignedUrlExpirationMinutes;

    @Autowired
    public FileServiceImpl(FileItemRepository fileRepository, UserRepository userRepository, 
                          FolderRepository folderRepository, StarredItemRepository starredRepository, 
                          TrashItemRepository trashRepository, S3Client s3Client, S3Presigner s3Presigner) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
        this.starredRepository = starredRepository;
        this.trashRepository = trashRepository;
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    @Override
    @Transactional
    public FileUploadResponse uploadFile(Long userId, MultipartFile file, Long folderId) {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get parent folder if specified (must belong to authenticated user)
        Folder parentFolder = null;
        if (folderId != null) {
            parentFolder = folderRepository.findByIdAndOwner(folderId, user)
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
        }


        // Check storage quota
        long fileSize = file.getSize();
        long currentUsage = fileRepository.getTotalStorageUsedByUser(user);
        long quota = user.getStorageQuota();
        if (currentUsage + fileSize > quota) {
            throw new RuntimeException("Storage quota exceeded");
        }

        // Create file key for S3
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String s3Key = "uploads/" + user.getId() + "/" + fileName;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, 
                    RequestBody.fromInputStream(file.getInputStream(), fileSize));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file input stream", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save file to S3", e);
        }

        // Create FileItem entity
        FileItem fileItem = new FileItem(
            file.getOriginalFilename(),
            getFileType(file.getContentType()),
            fileSize,
            file.getContentType(),
            s3Key, // Store S3 key as path
            user,
            fileName
        );

        fileItem.setParentFolder(parentFolder);
        
        // Save to database
        FileItem savedFile = fileRepository.save(fileItem);
        
        // Update user storage usage
        user.setStorageUsed(currentUsage + fileSize);
        userRepository.save(user);

        // Convert to response DTO
        return new FileUploadResponse(
            savedFile.getId(),
            savedFile.getName(),
            savedFile.getPath(),
            savedFile.getType(),
            savedFile.getSize(),
            savedFile.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public List<FileUploadResponse> listUserFiles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<FileItem> files = fileRepository.findByOwnerAndIsTrashedFalse(user);
        
        return files.stream()
                .map(file -> new FileUploadResponse(
                    file.getId(),
                    file.getName(),
                    file.getPath(),
                    file.getType(),
                    file.getSize(),
                    file.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public List<FileItem> getFilesInFolder(User user, Folder folder) {
        if (folder == null) {
            return fileRepository.findByOwnerAndParentFolderIsNullAndIsTrashedFalse(user);
        } else {
            return fileRepository.findByOwnerAndParentFolderAndIsTrashedFalse(user, folder);
        }
    }

    @Override
    @Transactional
    public FileUploadResponse getFileDetails(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        return new FileUploadResponse(
            file.getId(),
            file.getName(),
            file.getPath(),
            file.getType(),
            file.getSize(),
            file.getCreatedAt()
        );
    }

    @Transactional
    public FileItem renameFile(Long fileId, User user, String newName) {
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        file.setName(newName);
        return fileRepository.save(file);
    }

    @Override
    @Transactional
    public FileUploadResponse assignFileToFolder(Long userId, Long fileId, MoveFileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        Folder newParentFolder = null;
        if (request.folderId() != null) {
            // Folder must belong to the authenticated user
            newParentFolder = folderRepository.findByIdAndOwner(request.folderId(), user)
                    .orElseThrow(() -> new RuntimeException("Target folder not found"));
        }

        
        file.setParentFolder(newParentFolder);
        FileItem savedFile = fileRepository.save(file);
        
        return new FileUploadResponse(
            savedFile.getId(),
            savedFile.getName(),
            savedFile.getPath(),
            savedFile.getType(),
            savedFile.getSize(),
            savedFile.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public void deleteFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        // Move to trash
        file.setIsTrashed(true);
        file.setDeletedAt(LocalDateTime.now());
        
        // Create trash item
        TrashItem trashItem = new TrashItem(user, file, file.getName(), file.getPath());
        LocalDateTime now = LocalDateTime.now();
        trashItem.setDeletedAt(now);
        // Keep in trash for 30 days
        trashItem.setAutoDeleteAt(now.plusDays(30));
        trashRepository.save(trashItem);
        
        fileRepository.save(file);

    }

    @Override
    @Transactional
    public byte[] downloadFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(file.getPath())
                    .build();
            return s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read file from S3", e);
        }
    }

    @Override
    @Transactional
    public List<FileUploadResponse> getStarredFiles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FileItem> files = fileRepository.findByOwnerAndIsStarredTrueAndIsTrashedFalse(user);

        return files.stream()
                .map(file -> new FileUploadResponse(
                        file.getId(),
                        file.getName(),
                        file.getPath(),
                        file.getType(),
                        file.getSize(),
                        file.getCreatedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void starFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setIsStarred(true);
        fileRepository.save(file);

        StarredItem starredItem = new StarredItem(user, file);
        starredRepository.save(starredItem);
    }

    @Override
    @Transactional
    public void unstarFile(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setIsStarred(false);
        fileRepository.save(file);

        starredRepository.findByUserAndFile(user, file)
                .ifPresent(starredItem -> starredRepository.delete(starredItem));
    }

    @Override
    @Transactional
    public List<FileUploadResponse> searchUserFiles(Long userId, String query) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<FileItem> files;
        if (query == null || query.trim().isEmpty()) {
            files = fileRepository.findByOwnerAndIsTrashedFalse(user);
        } else {
            files = fileRepository.findByOwnerAndNameContainingIgnoreCaseAndIsTrashedFalse(user, query);
        }
        
        return files.stream()
                .map(file -> new FileUploadResponse(
                    file.getId(),
                    file.getName(),
                    file.getPath(),
                    file.getType(),
                    file.getSize(),
                    file.getCreatedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public List<FileUploadResponse> getRecentFiles(Long userId, Integer limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int safeLimit = (limit == null || limit <= 0) ? 20 : limit;

        // DB already orders by createdAt desc; limit in-memory since repository method has no limit.
        return fileRepository.findRecentFilesByOwner(user).stream()
                .limit(safeLimit)
                .map(file -> new FileUploadResponse(
                        file.getId(),
                        file.getName(),
                        null, // fileUrl not available in this backend version
                        file.getType(),
                        file.getSize(),
                        file.getCreatedAt()
                ))
                .toList();
    }



    @Transactional
    public List<FileItem> getFilesByType(User user, String type) {
        return fileRepository.findByOwnerAndTypeAndIsTrashedFalse(user, type);
    }

    @Transactional
    public void restoreFromTrash(Long trashItemId, User user) {
        TrashItem trashItem = trashRepository.findByIdAndUserOptional(trashItemId, user)
                .orElseThrow(() -> new RuntimeException("Trash item not found"));
        
        if (trashItem.getFile() != null) {
            FileItem file = trashItem.getFile();
            file.setIsTrashed(false);
            file.setDeletedAt(null);
            fileRepository.save(file);
        }
        
        trashRepository.delete(trashItem);
    }

    @Transactional
    public void permanentlyDeleteFromTrash(Long trashItemId, User user) {
        TrashItem trashItem = trashRepository.findByIdAndUserOptional(trashItemId, user)
                .orElseThrow(() -> new RuntimeException("Trash item not found"));
        
        // Delete actual file from S3
        if (trashItem.getFile() != null && trashItem.getFile().getPath() != null) {
            try {
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(trashItem.getFile().getPath())
                        .build();
                s3Client.deleteObject(deleteObjectRequest);
            } catch (Exception e) {
                System.err.println("Failed to delete file from S3: " + e.getMessage());
            }
        }
        
        trashRepository.delete(trashItem);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.clouddrive.dto.TrashItemResponse> listTrashItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();

        return trashRepository.findByUserOrderByDeletedAtDesc(user).stream()
                .map(ti -> {
                    LocalDateTime autoDeleteAt = ti.getAutoDeleteAt();
                    boolean canRestore = autoDeleteAt == null || autoDeleteAt.isAfter(now);

                    Long fileId = ti.getFile() != null ? ti.getFile().getId() : null;
                    String name = ti.getOriginalName();
                    String type = ti.getFile() != null ? ti.getFile().getType() : (ti.getFolder() != null ? "folder" : "unknown");
                    Long size = ti.getFile() != null ? ti.getFile().getSize() : 0L;

                    return new com.clouddrive.dto.TrashItemResponse(
                            ti.getId(),
                            fileId,
                            name,
                            type,
                            size,
                            ti.getOriginalPath(),
                            ti.getDeletedAt(),
                            autoDeleteAt,
                            canRestore
                    );
                })
                .toList();
    }

    @Override
    @Transactional
    public void restoreTrashItem(Long userId, Long trashItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrashItem trashItem = trashRepository.findByIdAndUserOptional(trashItemId, user)
                .orElseThrow(() -> new RuntimeException("Trash item not found"));

        LocalDateTime now = LocalDateTime.now();
        if (trashItem.getAutoDeleteAt() != null && trashItem.getAutoDeleteAt().isBefore(now)) {
            throw new RuntimeException("Trash item expired and cannot be restored");
        }

        restoreFromTrash(trashItemId, user);
    }

    @Override
    @Transactional
    public void permanentlyDeleteTrashItem(Long userId, Long trashItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        permanentlyDeleteFromTrash(trashItemId, user);
    }

    @Override
    @Transactional
    public void emptyTrash(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Empty all trash items for this user
        java.util.List<TrashItem> items = trashRepository.findByUserOrderByDeletedAtDesc(user);
        for (TrashItem item : items) {
            permanentlyDeleteFromTrash(item.getId(), user);
        }
    }

    private String getFileType(String contentType) {

        if (contentType == null) return "unknown";
        
        if (contentType.startsWith("image/")) return "image";
        if (contentType.startsWith("video/")) return "video";
        if (contentType.startsWith("audio/")) return "audio";
        if (contentType.equals("application/pdf")) return "pdf";
        if (contentType.startsWith("text/")) return "text";
        if (contentType.contains("document") || contentType.contains("sheet")) return "document";
        if (contentType.contains("zip") || contentType.contains("compressed")) return "archive";
        
        return "file";
    }

    @Override
    @Transactional
    public ShareFileResponse generateShareLink(Long userId, Long fileId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        FileItem file = fileRepository.findByIdAndOwner(fileId, user)
                .orElseThrow(() -> new RuntimeException("File not found"));
        
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(file.getPath())
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(presignedUrlExpirationMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            String shareUrl = presignedRequest.url().toString();

            return new ShareFileResponse(
                file.getId(),
                file.getName(),
                shareUrl,
                LocalDateTime.now().plusMinutes(presignedUrlExpirationMinutes).toInstant(java.time.ZoneOffset.UTC)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public com.clouddrive.dto.StorageResponse getStorageForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long storageUsed = fileRepository.getTotalStorageUsedByUser(user);
        Long storageQuota = user.getStorageQuota();

        double storagePercentage = 0.0;
        if (storageQuota != null && storageQuota > 0) {
            storagePercentage = (storageUsed.doubleValue() / storageQuota.doubleValue()) * 100.0;
        }

        return new com.clouddrive.dto.StorageResponse(storageUsed, storageQuota, storagePercentage);
    }
}
