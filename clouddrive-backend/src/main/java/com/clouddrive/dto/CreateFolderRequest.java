package com.clouddrive.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFolderRequest(
        @NotBlank(message = "Folder name is required")
        String name,
        Long parentId
) {
}
