package com.clouddrive.service.impl;

import com.clouddrive.dto.CreateFolderRequest;
import com.clouddrive.dto.FolderResponse;
import com.clouddrive.entity.Folder;
import com.clouddrive.entity.User;
import com.clouddrive.exception.BadRequestException;
import com.clouddrive.repository.FolderRepository;
import com.clouddrive.repository.UserRepository;
import com.clouddrive.service.FolderService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderServiceImpl(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public FolderResponse createFolder(Long userId, CreateFolderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Invalid user"));

        Long parentId = request.parentId();
        if (parentId != null) {
            folderRepository.findByIdAndUserId(parentId, userId)
                    .orElseThrow(() -> new BadRequestException("Parent folder not found"));
        }

        Folder folder = new Folder();
        folder.setName(request.name().trim());
        folder.setParentFolder(parentId != null ? folderRepository.findById(parentId).orElse(null) : null);
        folder.setOwner(user);
        Folder saved = folderRepository.save(folder);
        return map(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FolderResponse> listFolders(Long userId) {
        return folderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    private FolderResponse map(Folder folder) {
        return new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getParentFolder() != null ? folder.getParentFolder().getId() : null,
                folder.getCreatedAt()
        );
    }
}
