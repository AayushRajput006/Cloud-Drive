import { useState, useEffect } from 'react';
import versioningService from '../services/versioningService';

function FileVersions({ isOpen, onClose, file, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState({ version1: null, version2: null });

  useEffect(() => {
    if (isOpen && file) {
      loadVersions();
    }
  }, [isOpen, file]);

  const loadVersions = () => {
    setIsLoading(true);
    try {
      const fileVersions = versioningService.getVersions(file.id);
      setVersions(fileVersions);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (version) => {
    try {
      setIsLoading(true);
      const restoredVersion = versioningService.restoreVersion(file.id, version.id);
      
      // Reload versions to update current status
      loadVersions();
      
      onRestore?.(restoredVersion);
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (version) => {
    if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      try {
        const success = versioningService.deleteVersion(file.id, version.id);
        if (success) {
          loadVersions();
        }
      } catch (error) {
        console.error('Error deleting version:', error);
      }
    }
  };

  const handleCompare = (version1, version2) => {
    setCompareVersions({ version1, version2 });
    setCompareMode(true);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVersionTypeLabel = (version) => {
    if (version.isCurrent) return 'Current';
    if (version.versionNumber === 1) return 'Original';
    return `Version ${version.versionNumber}`;
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-4xl h-full mx-auto my-4 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">history</span>
            <div>
              <h2 className="text-h2 text-h2">File Versions</h2>
              <p className="text-body-sm text-on-surface-variant">{file.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => versioningService.exportVersions(file.id)}
              className="p-2 hover:bg-surface-container-low rounded-lg"
              title="Export version history"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                history
              </span>
              <h3 className="text-h3 text-h3 mb-2">No versions found</h3>
              <p className="text-body-md text-on-surface-variant">
                This file doesn't have any version history yet.
              </p>
            </div>
          ) : (
            <div className="p-4">
              {/* Version List */}
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`border border-outline-variant rounded-lg p-4 hover:border-primary transition-all ${
                      version.isCurrent ? 'bg-primary-fixed border-primary' : 'bg-white'
                    } ${selectedVersion?.id === version.id ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-body-sm font-medium ${
                            version.isCurrent ? 'text-primary' : 'text-on-surface'
                          }`}>
                            {getVersionTypeLabel(version)}
                          </span>
                          {version.isCurrent && (
                            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-body-sm text-on-surface-variant">
                          <div>
                            <span className="font-medium">Modified:</span>
                            <span>{formatDate(version.timestamp)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Size:</span>
                            <span>{formatFileSize(version.fileSize)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Author:</span>
                            <span>{version.author}</span>
                          </div>
                          {version.changeDescription && (
                            <div className="col-span-2">
                              <span className="font-medium">Changes:</span>
                              <span>{version.changeDescription}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setSelectedVersion(version)}
                          className="p-2 hover:bg-surface-container-low rounded-lg"
                          title="Select for comparison"
                        >
                          <span className="material-symbols-outlined text-sm">compare</span>
                        </button>
                        
                        {!version.isCurrent && (
                          <button
                            onClick={() => handleRestore(version)}
                            className="p-2 hover:bg-surface-container-low rounded-lg text-primary"
                            title="Restore this version"
                          >
                            <span className="material-symbols-outlined text-sm">restore</span>
                          </button>
                        )}
                        
                        {!version.isCurrent && (
                          <button
                            onClick={() => handleDelete(version)}
                            className="p-2 hover:bg-surface-container-low rounded-lg text-error"
                            title="Delete version"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version Comparison */}
              {compareMode && compareVersions.version1 && compareVersions.version2 && (
                <div className="mt-6 p-4 bg-surface-container-low rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-h3 text-h3">Version Comparison</h3>
                    <button
                      onClick={() => {
                        setCompareMode(false);
                        setCompareVersions({ version1: null, version2: null });
                      }}
                      className="p-2 hover:bg-surface-container rounded-lg"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-outline-variant rounded-lg p-3">
                      <h4 className="font-medium mb-2">
                        {getVersionTypeLabel(compareVersions.version1)}
                      </h4>
                      <p className="text-sm text-on-surface-variant mb-2">
                        {formatDate(compareVersions.version1.timestamp)}
                      </p>
                      <p className="text-sm">
                        Size: {formatFileSize(compareVersions.version1.fileSize)}
                      </p>
                    </div>
                    
                    <div className="border border-outline-variant rounded-lg p-3">
                      <h4 className="font-medium mb-2">
                        {getVersionTypeLabel(compareVersions.version2)}
                      </h4>
                      <p className="text-sm text-on-surface-variant mb-2">
                        {formatDate(compareVersions.version2.timestamp)}
                      </p>
                      <p className="text-sm">
                        Size: {formatFileSize(compareVersions.version2.fileSize)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-lg">
                    <p className="text-sm text-warning">
                      <strong>Note:</strong> Version comparison shows basic differences. 
                      For detailed diff analysis, consider using external tools.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileVersions;
