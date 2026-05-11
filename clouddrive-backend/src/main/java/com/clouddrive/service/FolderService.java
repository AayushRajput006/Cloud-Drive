package com.clouddrive.service;

import com.clouddrive.dto.CreateFolderRequest;
import com.clouddrive.dto.FolderResponse;
import java.util.List;

public interface FolderService {
    FolderResponse createFolder(Long userId, CreateFolderRequest request);

    List<FolderResponse> listFolders(Long userId);
}
