import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import { authService } from '../services/authService';

// Mock trash data - replace with actual API calls
const mockTrashFiles = [
  {
    id: 1,
    name: "Old Project Report.pdf",
    type: "document",
    size: 1024000,
    originalPath: "/Documents/Work/",
    deletedAt: "2026-05-01T10:00:00Z",
    deletedBy: "John Doe",
    fileType: "application/pdf",
    canRestore: true
  },
  {
    id: 2,
    name: "Draft Presentation.pptx",
    type: "document",
    size: 5242880,
    originalPath: "/Documents/Projects/",
    deletedAt: "2026-04-28T14:30:00Z",
    deletedBy: "John Doe",
    fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    canRestore: true
  },
  {
    id: 3,
    name: "Temp Files.zip",
    type: "archive",
    size: 2048576,
    originalPath: "/Downloads/",
    deletedAt: "2026-04-15T09:15:00Z",
    deletedBy: "John Doe",
    fileType: "application/zip",
    canRestore: false
  },
  {
    id: 4,
    name: "Meeting Recording.mp4",
    type: "video",
    size: 10240000,
    originalPath: "/Videos/",
    deletedAt: "2026-04-10T16:45:00Z",
    deletedBy: "John Doe",
    fileType: "video/mp4",
    canRestore: true
  }
];

function TrashPage() {
  const [trashFiles, setTrashFiles] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('deletedAt');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load trash files from API
    const token = authService.getToken();
    if (token) {
      // TODO: Replace with actual API call
      // fetch('/api/files/trash', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // .then(response => response.json())
      // .then(data => setTrashFiles(data));
      
      // Use mock data for now
      setTrashFiles(mockTrashFiles);
    }
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleViewModeChange = useCallback((newViewMode) => {
    setViewMode(newViewMode);
  }, []);

  const handleFileSelect = useCallback((file) => {
    // Handle file selection
    console.log('Selected file:', file);
  }, []);

  const handleFileAction = useCallback((action, file) => {
    switch (action) {
      case 'restore':
        if (file.canRestore) {
          console.log('Restoring file:', file);
          // TODO: Call API to restore file
        } else {
          alert('This file cannot be restored because it has been permanently deleted.');
        }
        break;
      case 'permanentDelete':
        const deleteConfirmed = window.confirm('Are you sure you want to permanently delete this file? This action cannot be undone.');
        if (deleteConfirmed) {
          console.log('Permanently deleting file:', file);
          // TODO: Call API to permanently delete file
        }
        break;
      case 'delete':
        const deleteConfirmed2 = window.confirm('Are you sure you want to permanently delete this file? This action cannot be undone.');
        if (deleteConfirmed2) {
          console.log('Permanently deleting file:', file);
          // TODO: Call API to permanently delete file
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  const handleBulkAction = useCallback((action) => {
    if (selectedFiles.length === 0) {
      alert('Please select files first.');
      return;
    }

    switch (action) {
      case 'restore':
        const restorableFiles = selectedFiles.filter(file => file.canRestore);
        if (restorableFiles.length === 0) {
          alert('Selected files cannot be restored because they have been permanently deleted.');
        } else if (restorableFiles.length < selectedFiles.length) {
          const restoreConfirmed = window.confirm(`${selectedFiles.length - restorableFiles.length} files cannot be restored because they have been permanently deleted. Continue with ${restorableFiles.length} files?`);
          if (restoreConfirmed) {
            console.log('Restoring files:', restorableFiles);
            // TODO: Call API to restore files
          }
        } else {
          console.log('Restoring files:', restorableFiles);
          // TODO: Call API to restore files
        }
        break;
      case 'permanentDelete':
        const permanentDeleteConfirmed = window.confirm(`Are you sure you want to permanently delete ${selectedFiles.length} file(s)? This action cannot be undone.`);
        if (permanentDeleteConfirmed) {
          console.log('Permanently deleting files:', selectedFiles);
          // TODO: Call API to permanently delete files
        }
        break;
      case 'emptyTrash':
        const emptyTrashConfirmed = window.confirm('Are you sure you want to empty trash? This will permanently delete all files in trash and cannot be undone.');
        if (emptyTrashConfirmed) {
          console.log('Emptying trash');
          // TODO: Call API to empty trash
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, [selectedFiles]);

  const sortedFiles = useCallback(() => {
    const sorted = [...trashFiles];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sorted.sort((a, b) => b.size - a.size);
      case 'deletedAt':
        return sorted.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
      default:
        return sorted;
    }
  }, [trashFiles, sortBy]);

  const getFileIcon = (type) => {
    const iconMap = {
      image: 'image',
      video: 'videocam',
      audio: 'headphones',
      pdf: 'picture_as_pdf',
      document: 'description',
      text: 'text_snippet',
      archive: 'folder_zip'
    };
    return iconMap[type] || 'insert_drive_file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDeletedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return diffDays + ' days ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
    return Math.floor(diffDays / 30) + ' months ago';
  };

  const getTotalSize = () => {
    return trashFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <AppShell sidebar={<DriveSidebar active="Trash" />} topbar={<DriveTopbar title="Trash" />}>
      <div className="p-lg">
        <div className="max-w-7xl mx-auto">
          {/* Header with Controls */}
          <div className="flex justify-between items-center mb-md">
            <h1 className="font-h1 text-h1 text-on-surface">Trash</h1>
            
            <div className="flex items-center gap-sm">
              {/* View Mode Toggle */}
              <div className="flex bg-surface-container-low rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-sm py-xs rounded ${
                    viewMode === 'list'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">view_list</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-sm py-xs rounded ${
                    viewMode === 'grid'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
              >
                <option value="deletedAt">Deleted Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>

          {/* Trash Actions */}
          <div className="flex gap-sm mb-md">
            {selectedFiles.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('restore')}
                  className="px-sm py-xs bg-success text-on-success rounded font-medium hover:bg-success-hover"
                >
                  <span className="material-symbols-outlined text-sm">restore</span>
                  Restore
                </button>
                
                <button
                  onClick={() => handleBulkAction('permanentDelete')}
                  className="px-sm py-xs bg-error text-on-error rounded font-medium hover:bg-error-hover"
                >
                  <span className="material-symbols-outlined text-sm">delete_forever</span>
                  Delete Forever
                </button>
              </>
            )}
            
            <button
              onClick={() => handleBulkAction('emptyTrash')}
              className="px-sm py-xs bg-surface-container-low text-on-surface-container-low rounded font-medium hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Empty Trash
            </button>
          </div>

          {/* Storage Info */}
          <div className="bg-surface-container-low rounded-lg p-md mb-md">
            <div className="flex justify-between items-center">
              <span className="text-label-sm text-on-surface-variant">Storage Used:</span>
              <span className="font-semibold text-label-sm text-on-surface">
                {formatFileSize(getTotalSize())}
              </span>
            </div>
            <p className="text-label-xs text-on-surface-variant mt-sm">
              Files in trash will be permanently deleted after 30 days
            </p>
          </div>

          {/* Trash Files List/Grid */}
          {trashFiles.length === 0 ? (
            <div className="text-center py-xl">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-3xl text-primary">delete</span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-sm">Trash is empty</h2>
              <p className="text-body-md text-on-surface-variant">
                Files you delete will appear here
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Go to My Files
              </button>
            </div>
          ) : (
            <div>
              <div className="text-label-sm text-on-surface-variant mb-md">
                {trashFiles.length} {trashFiles.length === 1 ? 'file' : 'files'}
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-md">
                  {sortedFiles().map((file) => (
                    <div
                      key={file.id}
                      className={`group relative bg-white border border-outline-variant rounded-lg p-sm hover:border-primary hover:shadow-md transition-all cursor-pointer ${
                        !file.canRestore ? 'opacity-60' : ''
                      }`}
                      onDoubleClick={() => file.canRestore && handleFileAction('restore', file)}
                    >
                      {/* File Icon */}
                      <div className="flex justify-center mb-sm">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          file.type === 'image' ? 'bg-primary-container-low' : 'bg-surface-container-low'
                        }`}>
                          <span className="material-symbols-outlined text-2xl text-primary">
                            {getFileIcon(file.type)}
                          </span>
                        </div>
                      </div>

                      {/* File Name */}
                      <h3 className="text-body-sm text-on-surface font-medium truncate text-center mb-sm">
                        {file.name}
                      </h3>

                      {/* Original Path */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        {file.originalPath}
                      </p>

                      {/* Deleted Date */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        Deleted {formatDeletedDate(file.deletedAt)}
                      </p>

                      {/* File Size */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        {formatFileSize(file.size)}
                      </p>

                      {/* Restore Status */}
                      <div className="text-center mb-sm">
                        <span className={`px-xs py-1 rounded-full text-xs ${
                          file.canRestore ? 'bg-success text-on-success' : 'bg-error text-on-error'
                        }`}>
                          {file.canRestore ? 'Can Restore' : 'Permanently Deleted'}
                        </span>
                      </div>

                      {/* Hover Actions */}
                      {file.canRestore && (
                        <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('restore', file);
                            }}
                            className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                          >
                            <span className="material-symbols-outlined text-sm">restore</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('permanentDelete', file);
                            }}
                            className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                          >
                            <span className="material-symbols-outlined text-sm text-error">delete_forever</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">
                          <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined">delete</span>
                            Name
                          </div>
                        </th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Size</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Original Path</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Deleted Date</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Status</th>
                        <th className="px-md py-sm text-right text-label-sm text-on-surface font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFiles().map((file) => (
                        <tr
                          key={file.id}
                          className={`border-b border-outline-variant hover:bg-surface-container-low cursor-pointer ${
                            !file.canRestore ? 'opacity-60' : ''
                          }`}
                          onDoubleClick={() => file.canRestore && handleFileAction('restore', file)}
                        >
                          <td className="px-md py-sm">
                            <div className="flex items-center gap-sm">
                              <span className="material-symbols-outlined text-primary">
                                {getFileIcon(file.type)}
                              </span>
                              <span className="text-body-sm text-on-surface font-medium">
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {file.originalPath}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {formatDeletedDate(file.deletedAt)}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            <span className={`px-xs py-1 rounded-full text-xs ${
                              file.canRestore ? 'bg-success text-on-success' : 'bg-error text-on-error'
                            }`}>
                              {file.canRestore ? 'Can Restore' : 'Permanently Deleted'}
                            </span>
                          </td>
                          <td className="px-md py-sm text-right">
                            <div className="flex justify-end gap-1">
                              <input
                                type="checkbox"
                                checked={selectedFiles.some(f => f.id === file.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFiles(prev => [...prev, file]);
                                  } else {
                                    setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
                                  }
                                }}
                                className="mr-sm"
                              />
                              {file.canRestore && (
                                <>
                                  <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileAction('restore', file);
                                      }}
                                    className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                                  >
                                    <span className="material-symbols-outlined text-sm">restore</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileAction('permanentDelete', file);
                                      }}
                                    className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                                  >
                                    <span className="material-symbols-outlined text-sm text-error">delete_forever</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default TrashPage;
