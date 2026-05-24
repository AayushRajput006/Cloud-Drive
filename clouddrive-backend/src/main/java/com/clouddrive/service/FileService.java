package com.clouddrive.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.clouddrive.dto.FileUploadResponse;
import com.clouddrive.dto.MoveFileRequest;
import com.clouddrive.dto.ShareFileResponse;

public interface FileService {
    FileUploadResponse uploadFile(Long userId, MultipartFile file, Long folderId);

    List<FileUploadResponse> listUserFiles(Long userId);

    List<FileUploadResponse> searchUserFiles(Long userId, String query);

    FileUploadResponse getFileDetails(Long userId, Long fileId);

    void deleteFile(Long userId, Long fileId);

    byte[] downloadFile(Long userId, Long fileId);

    FileUploadResponse assignFileToFolder(Long userId, Long fileId, MoveFileRequest request);

    ShareFileResponse generateShareLink(Long userId, Long fileId);

    // Starred files
    List<FileUploadResponse> getStarredFiles(Long userId);

    void starFile(Long userId, Long fileId);

    void unstarFile(Long userId, Long fileId);

    // Recently uploaded files (DB-based)
    java.util.List<com.clouddrive.dto.FileUploadResponse> getRecentFiles(Long userId, Integer limit);

    com.clouddrive.dto.StorageResponse getStorageForUser(Long userId);

    // Trash
    java.util.List<com.clouddrive.dto.TrashItemResponse> listTrashItems(Long userId);
    void restoreTrashItem(Long userId, Long trashItemId);
    void permanentlyDeleteTrashItem(Long userId, Long trashItemId);
    void emptyTrash(Long userId);
}



