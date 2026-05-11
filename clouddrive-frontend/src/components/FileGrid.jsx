import { useState, useCallback, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import FilePreview from './FilePreview';
import ContextMenu from './ContextMenu';
import favoritesService from '../services/favoritesService';

const FileGrid = ({ files, viewMode, sortBy, onSortChange, onViewModeChange, onFileSelect, onFileAction }) => {
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const [previewFile, setPreviewFile] = useState(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0, file: null });
  const [favorites, setFavorites] = useState(new Set());

  const handleFileClick = useCallback((file, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd key
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(file.id)) {
          newSet.delete(file.id);
        } else {
          newSet.add(file.id);
        }
        return newSet;
      });
    } else {
      // Single select and preview
      setSelectedFiles(new Set([file.id]));
      onFileSelect?.(file);
      // Open preview for supported file types
      if (['image', 'video', 'audio', 'pdf', 'text'].includes(file.type)) {
        setPreviewFile(file);
      }
    }
  }, [onFileSelect]);

  const handleContextMenu = useCallback((event, file) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
      file
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ isOpen: false, x: 0, y: 0, file: null });
  }, []);

  // Load favorites on component mount and update when files change
  useEffect(() => {
    const loadFavorites = () => {
      const favs = favoritesService.getFavorites();
      const favIds = new Set(favs.map(fav => fav.id));
      setFavorites(favIds);
    };
    
    loadFavorites();
  }, [files]);

  const handleToggleFavorite = useCallback((file, event) => {
    event.stopPropagation();
    try {
      if (favorites.has(file.id)) {
        favoritesService.removeFavorite(file.id);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.id);
          return newSet;
        });
      } else {
        favoritesService.addFavorite(file);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.add(file.id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [favorites]);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)));
    }
  }, [files, selectedFiles]);

  const handleAction = useCallback((action, file) => {
    onFileAction?.(action, file || Array.from(selectedFiles).map(id => files.find(f => f.id === id)));
  }, [selectedFiles, files, onFileAction]);

  const sortedFiles = useCallback(() => {
    const sorted = [...files];
    
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
  }, [files, sortBy]);

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

  const isAllSelected = selectedFiles.size === files.length && files.length > 0;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-md p-sm bg-surface border-b border-outline-variant rounded-t-lg">
        <div className="flex items-center gap-sm">
          <button
            onClick={handleSelectAll}
            className={`px-sm py-xs rounded text-label-sm font-medium ${
              isAllSelected
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
          
          {selectedFiles.size > 0 && (
            <span className="text-label-sm text-on-surface-variant">
              {selectedFiles.size} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-sm">
          {/* View Mode Toggle */}
          <div className="flex bg-surface-container-low rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-sm py-xs rounded ${
                viewMode === 'grid'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
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
            onChange={(e) => onSortChange(e.target.value)}
            className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="modified">Modified</option>
          </select>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-md p-sm">
          {sortedFiles().map((file) => (
            <div
              key={file.id}
              className={`group relative bg-white border border-outline-variant rounded-lg p-sm hover:border-primary hover:shadow-md transition-all cursor-pointer ${
                selectedFiles.has(file.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={(e) => handleFileClick(file, e)}
              onDoubleClick={() => handleAction('open', file)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-sm left-sm opacity-0 group-hover:opacity-100">
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => handleFileClick(file, { ctrlKey: true })}
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                />
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
              <h3 className="text-body-sm text-on-surface font-medium truncate text-center">
                {file.name}
              </h3>

              {/* File Size */}
              <p className="text-label-xs text-on-surface-variant text-center">
                {formatFileSize(file.size)}
              </p>

              {/* Hover Actions */}
              <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(file, e);
                  }}
                  className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                  title={favorites.has(file.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={`material-symbols-outlined text-sm ${favorites.has(file.id) ? 'text-warning' : 'text-on-surface-variant'}`}>
                    {favorites.has(file.id) ? 'star' : 'star_border'}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('download', file);
                  }}
                  className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('share', file);
                  }}
                  className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('delete', file);
                  }}
                  className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-sm text-error">delete</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('versions', file);
                  }}
                  className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                  title="View version history"
                >
                  <span className="material-symbols-outlined text-sm">history</span>
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
                <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                  />
                </th>
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
                  className={`border-b border-outline-variant hover:bg-surface-container-low cursor-pointer ${
                    selectedFiles.has(file.id) ? 'bg-primary-container text-on-primary-container' : ''
                  }`}
                  onClick={(e) => handleFileClick(file, e)}
                  onDoubleClick={() => handleAction('open', file)}
                >
                  <td className="px-md py-sm">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleFileClick(file, { ctrlKey: true })}
                      className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                    />
                  </td>
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
                    {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-md py-sm text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(file, e);
                        }}
                        className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                        title={favorites.has(file.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <span className={`material-symbols-outlined text-sm ${favorites.has(file.id) ? 'text-warning' : 'text-on-surface-variant'}`}>
                          {favorites.has(file.id) ? 'star' : 'star_border'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('download', file);
                        }}
                        className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('share', file);
                        }}
                        className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-sm">share</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('delete', file);
                        }}
                        className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                      >
                        <span className="material-symbols-outlined text-sm text-error">delete</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('versions', file);
                        }}
                        className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                        title="View version history"
                      >
                        <span className="material-symbols-outlined text-sm">history</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    
    {/* File Preview Modal */}
    {previewFile && (
      <FilePreview
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={(file) => handleAction('download', file)}
        onShare={(file) => handleAction('share', file)}
        onDelete={(file) => handleAction('delete', file)}
      />
    )}
    
    {/* Context Menu */}
    {contextMenu.isOpen && (
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        file={contextMenu.file}
        onClose={closeContextMenu}
        onAction={handleAction}
      />
    )}
  </div>
  );
}

export default FileGrid;
