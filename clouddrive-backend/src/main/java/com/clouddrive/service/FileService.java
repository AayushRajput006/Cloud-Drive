package com.clouddrive.service;

import com.clouddrive.dto.FileUploadResponse;
import com.clouddrive.dto.MoveFileRequest;
import com.clouddrive.dto.ShareFileResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    FileUploadResponse uploadFile(Long userId, MultipartFile file, Long folderId);

    List<FileUploadResponse> listUserFiles(Long userId);

    List<FileUploadResponse> searchUserFiles(Long userId, String query);

    FileUploadResponse getFileDetails(Long userId, Long fileId);

    void deleteFile(Long userId, Long fileId);

    byte[] downloadFile(Long userId, Long fileId);

    FileUploadResponse assignFileToFolder(Long userId, Long fileId, MoveFileRequest request);

    ShareFileResponse generateShareLink(Long userId, Long fileId);
}
