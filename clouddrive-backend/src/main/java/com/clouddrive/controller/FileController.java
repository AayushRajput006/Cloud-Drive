package com.clouddrive.controller;

import com.clouddrive.dto.FileUploadResponse;
import com.clouddrive.dto.MoveFileRequest;
import com.clouddrive.dto.ShareFileResponse;
import com.clouddrive.security.CustomUserDetails;
import com.clouddrive.service.FileService;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId
    ) {
        FileUploadResponse response = fileService.uploadFile(currentUser.getUserId(), file, folderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FileUploadResponse>> listFiles(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(fileService.listUserFiles(currentUser.getUserId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FileUploadResponse>> searchFiles(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam("query") String query
    ) {
        return ResponseEntity.ok(fileService.searchUserFiles(currentUser.getUserId(), query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileUploadResponse> getFileDetails(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(fileService.getFileDetails(currentUser.getUserId(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable("id") Long id
    ) {
        fileService.deleteFile(currentUser.getUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable("id") Long id
    ) {
        FileUploadResponse metadata = fileService.getFileDetails(currentUser.getUserId(), id);
        byte[] content = fileService.downloadFile(currentUser.getUserId(), id);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            mediaType = MediaType.parseMediaType(metadata.fileType());
        } catch (Exception ignored) {
            // Fallback to octet-stream when type is missing or invalid.
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.fileName() + "\"")
                .body(content);
    }

    @PutMapping("/{id}/folder")
    public ResponseEntity<FileUploadResponse> moveFileToFolder(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable("id") Long id,
            @RequestBody MoveFileRequest request
    ) {
        return ResponseEntity.ok(fileService.assignFileToFolder(currentUser.getUserId(), id, request));
    }

    @GetMapping("/share/{id}")
    public ResponseEntity<ShareFileResponse> shareFile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(fileService.generateShareLink(currentUser.getUserId(), id));
    }
}
