package com.clouddrive.dto;

public record StorageResponse(
        Long storageUsed,
        Long storageQuota,
        Double storagePercentage
) {
}

