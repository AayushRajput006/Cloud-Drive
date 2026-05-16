import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";
import FileGrid from "../components/FileGrid";
import FileOperations from "../components/FileOperations";
import ShareModal from "../components/ShareModal";
import FavoritesPanel from "../components/FavoritesPanel";
import FileVersions from "../components/FileVersions";
import RecentActivityPanel from "../components/RecentActivityPanel";
import TagManagementPanel from "../components/TagManagementPanel";
import FileTagging from "../components/FileTagging";

import fileService from "../services/fileService";
import favoritesService from "../services/favoritesService";
import versioningService from "../services/versioningService";
import activityService from "../services/activityService";
import taggingService from "../services/taggingService";

function DashboardPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const [isSearching, setIsSearching] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterSize, setFilterSize] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const [isDragging, setIsDragging] = useState(false);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const [folderPath, setFolderPath] = useState(["root"]);

  // Favorites state
  const [favoritesPanelOpen, setFavoritesPanelOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Versioning state
  const [versionsPanelOpen, setVersionsPanelOpen] = useState(false);
  const [selectedFileForVersions, setSelectedFileForVersions] = useState(null);

  // Recent activity state
  const [recentActivityPanelOpen, setRecentActivityPanelOpen] = useState(false);

  // Tagging state
  const [tagManagementPanelOpen, setTagManagementPanelOpen] = useState(false);
  const [fileTaggingPanelOpen, setFileTaggingPanelOpen] = useState(false);
  const [selectedFileForTagging, setSelectedFileForTagging] = useState(null);

  // =========================
  // Notifications
  // =========================
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // =========================
  // Load Files
  // =========================
  const loadFiles = useCallback(async () => {
    try {
      setPageLoading(true);
      setError(null);

      const data = await fileService.listFiles();
      setFiles(data || []);
    } catch (err) {
      console.error("Failed to load files:", err);
      setError(err.message || "Failed to load files");
      // Set empty files array to prevent crashes
      setFiles([]);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // =========================
  // Display Files
  // =========================
  const displayFiles = useMemo(() => {
    let filtered = searchQuery
      ? searchResults
      : files.filter((file) =>
          file.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Type Filter
    if (filterType !== "all") {
      filtered = filtered.filter((file) => file.type === filterType);
    }

    // Size Filter
    if (filterSize !== "all") {
      filtered = filtered.filter((file) => {
        if (filterSize === "small") return file.size < 1024 * 1024;
        if (filterSize === "medium")
          return file.size >= 1024 * 1024 && file.size <= 10 * 1024 * 1024;
        if (filterSize === "large") return file.size > 10 * 1024 * 1024;

        return true;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);

        case "size":
          return a.size - b.size;

        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);

        case "modified":
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    files,
    searchQuery,
    searchResults,
    filterType,
    filterSize,
    filterDate,
    sortBy,
  ]);

  // =========================
  // Search
  // =========================
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const results = await fileService.searchFiles(query);
      setSearchResults(results || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // =========================
  // File Actions
  // =========================
  const handleFileAction = useCallback(
    async (action, fileOrFiles) => {
      const fileArray = Array.isArray(fileOrFiles)
        ? fileOrFiles
        : [fileOrFiles];

      try {
        setOperationLoading(true);

        switch (action) {
          case "download":
            for (const file of fileArray) {
              await fileService.downloadFile(file.id);
            }

            showNotification("Download started");
            break;

          case "delete":
            for (const file of fileArray) {
              await fileService.deleteFile(file.id);
            }

            await loadFiles();
            setSelectedFiles(new Set());

            showNotification("Files deleted successfully");
            break;

          case "rename": {
            const file = fileArray[0];

            const newName = prompt("Enter new name", file.name);

            if (!newName) return;

            await fileService.renameFile(file.id, newName);

            await loadFiles();

            showNotification("File renamed");
            break;
          }

          case "share":
            if (fileArray.length === 1) {
              setShareFile(fileArray[0]);
              setShareModalOpen(true);
            }
            break;

          case "favorite":
            fileArray.forEach(file => {
              handleToggleFavorite(file);
            });
            break;

          case "versions":
            if (fileArray.length === 1) {
              handleShowVersions(fileArray[0]);
            }
            break;

          default:
            console.log("Action:", action);
        }
      } catch (err) {
        console.error(err);
        showNotification(
          err.message || "Operation failed",
          "error"
        );
      } finally {
        setOperationLoading(false);
      }
    },
    [loadFiles, showNotification]
  );

  // =========================
  // Favorites Functions
  // =========================
  const loadFavorites = useCallback(() => {
    try {
      const favs = favoritesService.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const handleToggleFavorite = useCallback((file) => {
    try {
      if (favoritesService.isFavorite(file.id)) {
        favoritesService.removeFavorite(file.id);
        showNotification('Removed from favorites');
      } else {
        favoritesService.addFavorite(file);
        showNotification('Added to favorites');
      }
      loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Failed to update favorites', 'error');
    }
  }, [showNotification, loadFavorites]);

  const handleFavoriteAction = useCallback((action, items) => {
    switch (action) {
      case 'download':
        items.forEach(item => {
          console.log('Downloading favorite:', item.name);
          // TODO: Implement download functionality
        });
        break;
      case 'share':
        if (items.length === 1) {
          setShareFile(items[0]);
          setShareModalOpen(true);
        }
        break;
      case 'remove':
        items.forEach(item => {
          favoritesService.removeFavorite(item.id);
        });
        loadFavorites();
        showNotification(`Removed ${items.length} favorite${items.length > 1 ? 's' : ''}`);
        break;
      default:
        console.log('Favorite action:', action, items);
    }
  }, [loadFavorites, showNotification]);

  // Load favorites on component mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // =========================
  // Versioning Functions
  // =========================
  const handleShowVersions = useCallback((file) => {
    setSelectedFileForVersions(file);
    setVersionsPanelOpen(true);
  }, []);

  const handleVersionRestore = useCallback((restoredVersion) => {
    showNotification('Version restored successfully');
    // TODO: Update file content in grid
  }, [showNotification]);

  // =========================
  // Recent Activity Functions
  // =========================
  const handleShowRecentActivity = useCallback(() => {
    setRecentActivityPanelOpen(true);
  }, []);

  const handleRecentActivityAction = useCallback((action, data) => {
    switch (action) {
      case 'search':
        setSearchQuery(data);
        // Trigger search
        break;
      case 'file_select':
        // Handle file selection from recent activity
        const file = files.find(f => f.id === data.id);
        if (file) {
          setSelectedFiles(new Set([file.id]));
        }
        break;
      default:
        console.log('Recent activity action:', action, data);
    }
  }, [files, setSearchQuery, setSelectedFiles]);

  // Track file access when files are selected
  const handleFileSelectWithTracking = useCallback((file) => {
    activityService.trackFileAccess(file, 'open');
  }, []);

  // Track file operations
  const handleFileActionWithTracking = useCallback((action, fileOrFiles) => {
    const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    
    // Track the operation
    if (fileArray.length === 1) {
      const file = fileArray[0];
      activityService.trackFileOperation(action, file, { 
        timestamp: new Date().toISOString() 
      });
    } else {
      // Bulk operations
      fileArray.forEach(file => {
        activityService.trackFileOperation(action, file, { 
          timestamp: new Date().toISOString(),
          bulkOperation: true 
        });
      });
    }

    // Call original handler
    handleFileAction(action, fileOrFiles);
  }, [handleFileAction]);

  // =========================
  // Tagging Functions
  // =========================
  const handleShowTagManagement = useCallback(() => {
    setTagManagementPanelOpen(true);
  }, []);

  const handleShowFileTagging = useCallback((file) => {
    setSelectedFileForTagging(file);
    setFileTaggingPanelOpen(true);
  }, []);

  const handleTagUpdate = useCallback((fileId, tagIds) => {
    activityService.trackFileOperation('tag', { id: fileId, name: 'File' }, {
      timestamp: new Date().toISOString(),
      tagIds,
      tagCount: tagIds.length
    });
    
    // Update file in grid if it exists
    const file = files.find(f => f.id === fileId);
    if (file) {
      showNotification('Tags updated successfully');
    }
  }, [files, showNotification]);

  // =========================
  // Keyboard Shortcuts
  // =========================
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Ctrl + A
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        event.preventDefault();

        setSelectedFiles(new Set(displayFiles.map((f) => f.id)));
      }

      // Delete
      if (event.key === "Delete" && selectedFiles.size > 0) {
        const filesToDelete = displayFiles.filter((file) =>
          selectedFiles.has(file.id)
        );

        handleFileAction("delete", filesToDelete);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayFiles, selectedFiles, handleFileAction]);

  // =========================
  // Share
  // =========================
  const handleShare = async (shareData) => {
    const baseUrl = window.location.origin;

    return {
      shareLink: `${baseUrl}/shared/${shareData.fileId}`,
    };
  };

  // =========================
  // Drag & Drop Upload
  // =========================
  const handleDrop = async (e) => {
    e.preventDefault();

    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (!droppedFiles.length) return;

    showNotification(
      `Uploading ${droppedFiles.length} file(s)...`,
      "info"
    );

    for (const file of droppedFiles) {
      try {
        const uploadedFile = await fileService.uploadFile(file);
        activityService.trackFileOperation('upload', uploadedFile, { timestamp: new Date().toISOString() });
        setFiles((prev) => [uploadedFile, ...prev]);
        showNotification(`${file.name} uploaded successfully`, "success");
      } catch (err) {
        showNotification(`Failed to upload ${file.name}`, "error");
      }
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <AppShell
      sidebar={<DriveSidebar active="My Files" />}
      topbar={<DriveTopbar title="My Files" />}
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-md py-sm rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-success text-on-success"
              : notification.type === "error"
              ? "bg-error text-on-error"
              : "bg-info text-on-info"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Loading Overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-lg rounded-xl shadow-lg">
            Processing...
          </div>
        </div>
      )}

      <div className="p-lg">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between gap-lg mb-xl">

            <h1 className="text-3xl font-bold">
              My Files
            </h1>

            <div className="flex flex-wrap gap-md items-center">

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border rounded-lg px-md py-sm w-72"
                />

                {isSearching && (
                  <span className="absolute right-3 top-2">
                    Searching...
                  </span>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-md py-sm"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="created">Created</option>
                <option value="modified">Modified</option>
              </select>

              {/* Favorites */}
              <button
                onClick={() => setFavoritesPanelOpen(true)}
                className="bg-secondary text-white px-md py-sm rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined">star</span>
                Favorites ({favorites.length})
              </button>

              {/* Recent Activity */}
              <button
                onClick={handleShowRecentActivity}
                className="bg-tertiary text-white px-md py-sm rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined">recent_actors</span>
                Recent Activity
              </button>

              {/* Tag Management */}
              <button
                onClick={handleShowTagManagement}
                className="bg-warning text-white px-md py-sm rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined">sell</span>
                Tags
              </button>

              {/* Upload */}
              <button
                onClick={() => navigate("/upload")}
                className="bg-primary text-white px-md py-sm rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="mb-lg flex gap-sm items-center">
            {folderPath.map((folder, index) => (
              <div key={index} className="flex gap-sm items-center">
                <button className="text-primary">
                  {folder}
                </button>

                {index !== folderPath.length - 1 && (
                  <span>/</span>
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-md rounded-lg mb-lg">
              <p>{error}</p>

              <button
                onClick={loadFiles}
                className="mt-sm bg-red-600 text-white px-md py-sm rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {pageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Drag Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-10 mb-xl transition-all ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <p className="text-lg font-medium">
                    Drag & Drop files here
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    or click Upload button
                  </p>
                </div>
              </div>

              {/* File Grid */}
              <FileGrid
                files={displayFiles}
                viewMode={viewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onViewModeChange={setViewMode}
                onFileSelect={handleFileSelectWithTracking}
                onFileAction={handleFileActionWithTracking}
              />
            </>
          )}

          {/* File Operations */}
          <FileOperations
            files={files}
            selectedFiles={selectedFiles}
            onFilesSelected={setSelectedFiles}
            onRename={async (fileId, newName) => {
              await fileService.renameFile(fileId, newName);
              await loadFiles();
            }}
            onDelete={async (filesToDelete) => {
              for (const file of filesToDelete) {
                await fileService.deleteFile(file.id);
              }

              await loadFiles();

              setSelectedFiles(new Set());
            }}
            onMove={async () => {}}
            onCopy={async () => {}}
            onShare={async (filesToShare) => {
              console.log(filesToShare);
            }}
          />
        </div>

        {/* Share Modal */}
        {shareModalOpen && shareFile && (
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => {
              setShareModalOpen(false);
              setShareFile(null);
            }}
            file={shareFile}
            onShare={handleShare}
          />
        )}

        {/* Favorites Panel */}
        <FavoritesPanel
          isOpen={favoritesPanelOpen}
          onClose={() => setFavoritesPanelOpen(false)}
          onFileSelect={(file) => {
            console.log('Selected favorite:', file);
            // TODO: Navigate to file or open file preview
          }}
          onFileAction={handleFavoriteAction}
        />

        {/* Versions Panel */}
        {selectedFileForVersions && (
          <FileVersions
            isOpen={versionsPanelOpen}
            onClose={() => {
              setVersionsPanelOpen(false);
              setSelectedFileForVersions(null);
            }}
            file={selectedFileForVersions}
            onRestore={handleVersionRestore}
          />
        )}

        {/* Recent Activity Panel */}
        <RecentActivityPanel
          isOpen={recentActivityPanelOpen}
          onClose={() => setRecentActivityPanelOpen(false)}
          onFileSelect={handleRecentActivityAction}
          onActivityAction={handleRecentActivityAction}
        />

        {/* Tag Management Panel */}
        <TagManagementPanel
          isOpen={tagManagementPanelOpen}
          onClose={() => setTagManagementPanelOpen(false)}
          onFileSelect={handleRecentActivityAction}
          onTagUpdate={handleTagUpdate}
        />

        {/* File Tagging Panel */}
        {selectedFileForTagging && (
          <FileTagging
            isOpen={fileTaggingPanelOpen}
            onClose={() => {
              setFileTaggingPanelOpen(false);
              setSelectedFileForTagging(null);
            }}
            file={selectedFileForTagging}
            onTagUpdate={handleTagUpdate}
          />
        )}
      </div>
    </AppShell>
  );
}

export default DashboardPage;