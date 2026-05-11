import { useState } from 'react';

const FileOperations = ({ 
  files, 
  selectedFiles, 
  onFilesSelected, 
  onRename, 
  onDelete, 
  onMove, 
  onCopy, 
  onShare 
}) => {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleRename = () => {
    if (selectedFiles.length === 1) {
      setRenameValue(selectedFiles[0].name);
      setShowRenameModal(true);
    }
  };

  const handleRenameSubmit = () => {
    if (selectedFiles.length === 1 && renameValue.trim()) {
      onRename?.(selectedFiles[0].id, renameValue.trim());
      setShowRenameModal(false);
      setRenameValue('');
    }
  };

  const handleDelete = () => {
    if (selectedFiles.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`);
      if (confirmed) {
        onDelete?.(selectedFiles);
      }
    }
  };

  const handleMove = () => {
    if (selectedFiles.length > 0) {
      setShowMoveModal(true);
    }
  };

  const handleMoveSubmit = () => {
    if (selectedFiles.length > 0 && selectedFolder) {
      onMove?.(selectedFiles, selectedFolder);
      setShowMoveModal(false);
      setSelectedFolder(null);
    }
  };

  const handleShare = () => {
    if (selectedFiles.length > 0) {
      setShowShareModal(true);
    }
  };

  const handleShareSubmit = () => {
    if (selectedFiles.length > 0) {
      onShare?.(selectedFiles);
      setShowShareModal(false);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-sm mb-md">
        {selectedFiles.length > 0 && (
          <>
            <button
              onClick={handleRename}
              disabled={selectedFiles.length !== 1}
              className="px-sm py-xs bg-surface-container-low text-on-surface-container-low rounded font-medium hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Rename
            </button>
            
            <button
              onClick={handleMove}
              className="px-sm py-xs bg-surface-container-low text-on-surface-container-low rounded font-medium hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-sm">folder</span>
              Move
            </button>
            
            <button
              onClick={handleCopy}
              className="px-sm py-xs bg-surface-container-low text-on-surface-container-low rounded font-medium hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy
            </button>
            
            <button
              onClick={handleShare}
              className="px-sm py-xs bg-surface-container-low text-on-surface-container-low rounded font-medium hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Share
            </button>
            
            <button
              onClick={handleDelete}
              className="px-sm py-xs bg-error text-on-error rounded font-medium hover:bg-error-hover"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-outline-variant rounded-xl p-xl w-full max-w-md mx-4">
            <h2 className="font-h2 text-h2 text-on-surface mb-lg">Rename File</h2>
            
            <div className="mb-lg">
              <label htmlFor="rename-input" className="block text-body-sm text-on-surface font-medium mb-sm">
                New Name
              </label>
              <input
                id="rename-input"
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary"
                placeholder="Enter new file name"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-md py-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={!renameValue.trim()}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-outline-variant rounded-xl p-xl w-full max-w-md mx-4">
            <h2 className="font-h2 text-h2 text-on-surface mb-lg">Move Files</h2>
            
            <div className="mb-lg">
              <label htmlFor="folder-select" className="block text-body-sm text-on-surface font-medium mb-sm">
                Select Destination Folder
              </label>
              <select
                id="folder-select"
                value={selectedFolder || ''}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary"
              >
                <option value="">Select a folder...</option>
                <option value="1">Documents</option>
                <option value="2">Images</option>
                <option value="3">Videos</option>
                <option value="4">Projects</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-md py-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMoveSubmit}
                disabled={!selectedFolder}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-outline-variant rounded-xl p-xl w-full max-w-md mx-4">
            <h2 className="font-h2 text-h2 text-on-surface mb-lg">Share Files</h2>
            
            <div className="mb-lg">
              <div className="bg-surface-container-low rounded-lg p-md">
                <h3 className="font-h3 text-h3 text-on-surface mb-md">Share with:</h3>
                <div className="space-y-sm">
                  <label className="flex items-center gap-sm">
                    <input type="radio" name="share-type" className="mr-sm" />
                    <span className="text-body-sm text-on-surface">Anyone with the link</span>
                  </label>
                  <label className="flex items-center gap-sm">
                    <input type="radio" name="share-type" className="mr-sm" />
                    <span className="text-body-sm text-on-surface">Specific people</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-md">
                <label className="block text-body-sm text-on-surface font-medium mb-sm">
                  Share Link
                </label>
                <div className="flex gap-sm">
                  <input
                    type="text"
                    readOnly
                    value="https://clouddrive.example/share/abc123"
                    className="flex-1 px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText('https://clouddrive.example/share/abc123')}
                    className="px-sm py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-hover"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-md py-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileOperations;
