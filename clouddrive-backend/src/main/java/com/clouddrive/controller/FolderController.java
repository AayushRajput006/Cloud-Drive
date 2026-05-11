package com.clouddrive.controller;

import com.clouddrive.dto.CreateFolderRequest;
import com.clouddrive.dto.FolderResponse;
import com.clouddrive.security.CustomUserDetails;
import com.clouddrive.service.FolderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody CreateFolderRequest request
    ) {
        return ResponseEntity.ok(folderService.createFolder(currentUser.getUserId(), request));
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> listFolders(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(folderService.listFolders(currentUser.getUserId()));
    }
}
