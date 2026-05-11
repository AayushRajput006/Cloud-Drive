package com.clouddrive.dto;

import java.time.LocalDateTime;

public record FolderResponse(
        Long id,
        String name,
        Long parentId,
        LocalDateTime createdAt
) {
}
