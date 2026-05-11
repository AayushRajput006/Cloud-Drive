import { useState, useEffect } from 'react';

function UploadProgress({ uploads, onUploadComplete, onUploadError }) {
  const [expandedUploads, setExpandedUploads] = useState(new Set());

  const toggleExpanded = (uploadId) => {
    setExpandedUploads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uploadId)) {
        newSet.delete(uploadId);
      } else {
        newSet.add(uploadId);
      }
      return newSet;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-success';
    if (progress > 50) return 'bg-warning';
    return 'bg-primary';
  };

  useEffect(() => {
    // Check for completed uploads and notify
    uploads.forEach(upload => {
      if (upload.progress === 100 && !upload.completed) {
        onUploadComplete?.(upload);
      }
    });

    // Check for failed uploads
    uploads.forEach(upload => {
      if (upload.error && !upload.notified) {
        onUploadError?.(upload);
      }
    });
  }, [uploads, onUploadComplete, onUploadError]);

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-outline-variant rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant">
        <h3 className="font-h3 text-h3 text-on-surface">Uploads ({uploads.length})</h3>
        <button
          onClick={() => setExpandedUploads(new Set())}
          className="text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className={`border-b border-outline-variant last:border-b-0 ${
              expandedUploads.has(upload.id) ? 'bg-surface-container-low' : ''
            }`}
          >
            <div
              className="p-sm cursor-pointer hover:bg-surface-container-low"
              onClick={() => toggleExpanded(upload.id)}
            >
              <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-sm flex-1 min-w-0">
                  <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center mr-sm">
                    <span className="material-symbols-outlined text-sm text-primary">
                      {upload.type === 'image' ? 'image' :
                       upload.type === 'video' ? 'videocam' :
                       upload.type === 'audio' ? 'headphones' :
                       upload.type === 'pdf' ? 'picture_as_pdf' :
                       upload.type === 'document' ? 'description' :
                       'insert_drive_file'}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-on-surface font-medium truncate">
                      {upload.name}
                    </p>
                    <p className="text-label-xs text-on-surface-variant">
                      {formatFileSize(upload.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-sm">
                  {upload.completed ? (
                    <span className="text-success text-xs font-medium">Complete</span>
                  ) : upload.error ? (
                    <span className="text-error text-xs font-medium">Failed</span>
                  ) : (
                    <span className="text-primary text-xs font-medium">
                      {Math.round(upload.progress)}%
                    </span>
                  )}
                  
                  {!upload.completed && !upload.error && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement cancel upload
                        console.log('Cancel upload:', upload.id);
                      }}
                      className="text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {upload.progress < 100 && !upload.error && (
                <div className="mt-sm">
                  <div className="flex justify-between text-label-xs text-on-surface-variant mb-xs">
                    <span>{formatFileSize(upload.loaded)}</span>
                    <span>{formatFileSize(upload.size)}</span>
                    <span>{formatTime(upload.remainingTime || 0)}</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(upload.progress)}`}
                      style={{ width: upload.progress + '%' }}
                    />
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {expandedUploads.has(upload.id) && (
                <div className="mt-sm p-sm bg-surface-container-low rounded-lg">
                  <div className="grid grid-cols-2 gap-sm text-label-sm text-on-surface-variant">
                    <div>
                      <span className="font-medium">Type:</span>
                      <span>{upload.type}</span>
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>
                      <span>{formatFileSize(upload.size)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Speed:</span>
                      <span>{upload.speed ? formatFileSize(upload.speed) + '/s' : 'Calculating...'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Started:</span>
                      <span>{new Date(upload.startTime).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {upload.error && (
                    <div className="mt-sm p-sm bg-error-container rounded-lg">
                      <p className="text-error text-sm font-medium">Error: {upload.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadProgress;
