import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import { authService } from '../services/authService';

// Mock starred data - replace with actual API calls
const mockStarredFiles = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: 245760,
    starred: true,
    createdAt: "2026-05-10T10:30:00Z",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },
  {
    id: 2,
    name: "Design Mockup.png",
    type: "image",
    size: 1024000,
    starred: true,
    createdAt: "2026-05-09T15:20:00Z",
    fileType: "image/png"
  },
  {
    id: 3,
    name: "Budget Spreadsheet.xlsx",
    type: "document",
    size: 512000,
    starred: true,
    createdAt: "2026-05-08T09:15:00Z",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
];

function StarredPage() {
  const [starredFiles, setStarredFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  useEffect(() => {
    // Load starred files from API
    const token = authService.getToken();
    if (token) {
      // TODO: Replace with actual API call
      // fetch('/api/files/starred', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // })
      // .then(response => response.json())
      // .then(data => setStarredFiles(data));
      
      // Use mock data for now
      setStarredFiles(mockStarredFiles);
    }
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleViewModeChange = useCallback((newViewMode) => {
    setViewMode(newViewMode);
  }, []);

  const handleFileAction = useCallback((action, file) => {
    switch (action) {
      case 'unstar':
        console.log('Unstarring file:', file);
        // TODO: Call API to unstar file
        break;
      case 'download':
        console.log('Downloading file:', file);
        break;
      case 'share':
        console.log('Sharing file:', file);
        break;
      case 'delete':
        console.log('Deleting file:', file);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  const sortedFiles = useCallback(() => {
    const sorted = [...starredFiles];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sorted.sort((a, b) => b.size - a.size);
      case 'modified':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  }, [starredFiles, sortBy]);

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

  return (
    <AppShell sidebar={<DriveSidebar active="Starred" />} topbar={<DriveTopbar title="Starred Files" />}>
      <div className="p-lg">
        <div className="max-w-7xl mx-auto">
          {/* Header with Controls */}
          <div className="flex justify-between items-center mb-md">
            <h1 className="font-h1 text-h1 text-on-surface">Starred Files</h1>
            
            <div className="flex items-center gap-sm">
              {/* View Mode Toggle */}
              <div className="flex bg-surface-container-low rounded-lg p-1">
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
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="modified">Modified</option>
              </select>
            </div>
          </div>

          {/* Starred Files Grid/List */}
          {starredFiles.length === 0 ? (
            <div className="text-center py-xl">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-3xl text-primary">star</span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-sm">No starred files</h2>
              <p className="text-body-md text-on-surface-variant">
                Star files to quickly access your important documents
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Go to My Files
              </button>
            </div>
          ) : (
            <div className="text-label-sm text-on-surface-variant mb-md">
              {starredFiles.length} {starredFiles.length === 1 ? 'file' : 'files'}
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-md">
              {sortedFiles().map((file) => (
                <div
                  key={file.id}
                  className="group relative bg-white border border-outline-variant rounded-lg p-sm hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onDoubleClick={() => handleFileAction('download', file)}
                >
                  {/* Star Icon */}
                  <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('unstar', file);
                      }}
                      className="w-8 h-8 bg-white border border-outline-variant rounded-full flex items-center justify-center hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-sm text-primary">star</span>
                    </button>
                  </div>

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

                  {/* File Size */}
                  <p className="text-label-xs text-on-surface-variant text-center">
                    {formatFileSize(file.size)}
                  </p>

                  {/* Hover Actions */}
                  <div className="absolute bottom-sm left-sm right-sm opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('download', file);
                      }}
                      className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('share', file);
                      }}
                      className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-sm">share</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('delete', file);
                      }}
                      className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-sm text-error">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Name</th>
                    <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Size</th>
                    <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Modified</th>
                    <th className="px-md py-sm text-right text-label-sm text-on-surface font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiles().map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-outline-variant hover:bg-surface-container-low cursor-pointer"
                      onDoubleClick={() => handleFileAction('download', file)}
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
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-md py-sm text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('unstar', file);
                            }}
                            className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                          >
                            <span className="material-symbols-outlined text-sm text-primary">star</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('download', file);
                            }}
                            className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('share', file);
                            }}
                            className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                          >
                            <span className="material-symbols-outlined text-sm">share</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('delete', file);
                            }}
                            className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                          >
                            <span className="material-symbols-outlined text-sm text-error">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default StarredPage;
