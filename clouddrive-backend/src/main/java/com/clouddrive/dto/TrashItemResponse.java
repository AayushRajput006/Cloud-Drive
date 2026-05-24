package com.clouddrive.dto;

import java.time.LocalDateTime;

public record TrashItemResponse(
        Long trashItemId,
        Long fileId,
        String name,
        String type,
        Long size,
        String originalPath,
        LocalDateTime deletedAt,
        LocalDateTime autoDeleteAt,
        boolean canRestore
) {
}

