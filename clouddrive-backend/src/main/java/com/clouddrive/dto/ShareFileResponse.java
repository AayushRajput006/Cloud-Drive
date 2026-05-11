package com.clouddrive.dto;

import java.time.Instant;

public record ShareFileResponse(
        Long fileId,
        String fileName,
        String shareUrl,
        Instant expiresAt
) {
}
