import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const FolderManager = ({ folders, onFolderCreate, onFolderSelect, onFolderAction }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolders, setSelectedFolders] = useState(new Set());
  const navigate = useNavigate();

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      onFolderCreate?.(newFolderName.trim());
      setNewFolderName('');
      setShowCreateModal(false);
    }
  }, [newFolderName, onFolderCreate]);

  const handleFolderClick = useCallback((folder, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd key
      setSelectedFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(folder.id)) {
          newSet.delete(folder.id);
        } else {
          newSet.add(folder.id);
        }
        return newSet;
      });
    } else {
      // Single select
      setSelectedFolders(new Set([folder.id]));
      onFolderSelect?.(folder);
    }
  }, [onFolderSelect]);

  const handleFolderAction = useCallback((action, folder) => {
    onFolderAction?.(action, folder || Array.from(selectedFolders).map(id => folders.find(f => f.id === id)));
  }, [selectedFolders, folders, onFolderAction]);

  const isAllSelected = selectedFolders.size === folders.length && folders.length > 0;

  return (
    <div className="w-full">
      {/* Folder Actions Toolbar */}
      <div className="flex justify-between items-center mb-md p-sm bg-surface border-b border-outline-variant rounded-t-lg">
        <div className="flex items-center gap-sm">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-sm py-xs bg-primary text-on-primary rounded-lg font-semibold flex items-center gap-sm hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined">create_new_folder</span>
            New Folder
          </button>
          
          {selectedFolders.size > 0 && (
            <span className="text-label-sm text-on-surface-variant">
              {selectedFolders.size} selected
            </span>
          )}
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`group relative bg-white border border-outline-variant rounded-xl p-md hover:border-primary hover:shadow-md transition-all cursor-pointer ${
              selectedFolders.has(folder.id) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={(e) => handleFolderClick(folder, e)}
            onDoubleClick={() => handleFolderAction('open', folder)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-sm left-sm opacity-0 group-hover:opacity-100">
              <input
                type="checkbox"
                checked={selectedFolders.has(folder.id)}
                onChange={() => handleFolderClick(folder, { ctrlKey: true })}
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
              />
            </div>

            {/* Folder Icon */}
            <div className="flex justify-center mb-sm">
              <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">folder</span>
              </div>
            </div>

            {/* Folder Name */}
            <h3 className="text-body-md text-on-surface font-medium truncate text-center mb-sm">
              {folder.name}
            </h3>

            {/* File Count */}
            <p className="text-label-sm text-on-surface-variant text-center mb-sm">
              {folder.fileCount || 0} {folder.fileCount === 1 ? 'file' : 'files'}
            </p>

            {/* Modified Date */}
            <p className="text-label-xs text-on-surface-variant text-center">
              {new Date(folder.createdAt).toLocaleDateString()}
            </p>

            {/* Hover Actions */}
            <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderAction('rename', folder);
                }}
                className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderAction('share', folder);
                }}
                className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderAction('delete', folder);
                }}
                className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-sm text-error">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-outline-variant rounded-xl p-xl w-full max-w-md mx-4">
            <h2 className="font-h2 text-h2 text-on-surface mb-lg">Create New Folder</h2>
            
            <div className="mb-lg">
              <label htmlFor="folderName" className="block text-body-sm text-on-surface font-medium mb-sm">
                Folder Name
              </label>
              <input
                id="folderName"
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-md py-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderManager;
