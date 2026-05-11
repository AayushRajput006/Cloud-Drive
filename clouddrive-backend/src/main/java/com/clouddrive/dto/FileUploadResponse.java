package com.clouddrive.dto;

import java.time.LocalDateTime;

public record FileUploadResponse(
        Long id,
        String fileName,
        String fileUrl,
        String fileType,
        Long size,
        LocalDateTime uploadDate
) {
}
