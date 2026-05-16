import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import { authService } from '../services/authService';
import fileService from '../services/fileService';
import activityService from '../services/activityService';

function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files) => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      // Set upload progress
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));

      try {
        // Simulate upload progress
        const intervalId = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0;
            if (typeof current !== 'number') return prev;
            return {
              ...prev,
              [file.name]: Math.min(current + 15, 90)
            };
          });
        }, 200);

        // Use actual fileService API
        const uploadedFile = await fileService.uploadFile(file);
        clearInterval(intervalId);
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 'success'
        }));
        
        showNotification(`File ${file.name} uploaded successfully`, "success");
        activityService.trackFileOperation('upload', uploadedFile, { timestamp: new Date().toISOString() });
        
        // Remove progress after completion
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 3000);
        
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 'error'
        }));
        showNotification(`Failed to upload ${file.name}`, "error");
      }
    }
  };

  return (
    <AppShell sidebar={<DriveSidebar active="Upload" />} topbar={<DriveTopbar title="Upload Files" />}>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-md py-sm rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
            notification.type === "success"
              ? "bg-success text-on-success"
              : notification.type === "error"
              ? "bg-error text-on-error"
              : "bg-info text-on-info"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && (
              <span className="material-symbols-outlined text-on-success">check_circle</span>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="p-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-md">Upload Files</h1>
            <p className="text-body-md text-on-surface-variant">
              Drag and drop your files here or click to browse
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-xl text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary-container text-on-primary-container'
                : 'border-outline-variant bg-surface text-on-surface'
            } ${Object.keys(uploadProgress).some(k => typeof uploadProgress[k] === 'number') ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-lg">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
              </div>
              <div>
                <p className="font-h3 text-h3 text-on-surface mb-sm">
                  {isDragging ? 'Drop files here' : 'Drag files here'}
                </p>
                <p className="text-body-sm text-on-surface-variant mb-md">
                  or
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={Object.keys(uploadProgress).some(k => typeof uploadProgress[k] === 'number')}
                  />
                  <span className={`px-md py-sm bg-primary text-on-primary rounded-lg font-semibold transition-colors ${Object.keys(uploadProgress).some(k => typeof uploadProgress[k] === 'number') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-hover'}`}>
                    Browse Files
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-xl">
              <h2 className="font-h3 text-h3 text-on-surface mb-md">Upload Progress</h2>
              <div className="space-y-md">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="bg-white border border-outline-variant rounded-lg p-md transition-all duration-500">
                    <div className="flex justify-between items-center mb-sm">
                      <span className="text-body-sm text-on-surface font-medium truncate flex items-center gap-2">
                        {progress === 'success' && (
                          <span className="material-symbols-outlined text-success text-sm">check_circle</span>
                        )}
                        {fileName}
                      </span>
                      <span className={`text-label-sm ${
                        progress === 'error' ? 'text-error' : progress === 'success' ? 'text-success' : 'text-on-surface-variant'
                      }`}>
                        {progress === 'error' ? 'Failed' : progress === 'success' ? 'Completed' : `${progress}%`}
                      </span>
                    </div>
                    <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          progress === 'error' ? 'bg-error' : progress === 'success' ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: progress === 'error' || progress === 'success' ? '100%' : `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Options */}
          <div className="mt-xl bg-white border border-outline-variant rounded-xl p-lg">
            <h3 className="font-h3 text-h3 text-on-surface mb-md">Upload Options</h3>
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="convert-to-pdf"
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="convert-to-pdf" className="text-body-sm text-on-surface">
                  Convert documents to PDF
                </label>
              </div>
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="create-thumbnails"
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                  defaultChecked
                />
                <label htmlFor="create-thumbnails" className="text-body-sm text-on-surface">
                  Create thumbnails for images
                </label>
              </div>
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="compress-files"
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="compress-files" className="text-body-sm text-on-surface">
                  Compress files when possible
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            <div className="bg-white border border-outline-variant rounded-xl p-lg text-center">
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-primary">folder</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">Create Folder</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                Organize files in folders
              </p>
              <button className="w-full px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                New Folder
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-lg text-center">
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-primary">share</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">Share Files</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                Share with others securely
              </p>
              <button className="w-full px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                Share
              </button>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-lg text-center">
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-primary">history</span>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">Recent Uploads</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                View recently uploaded files
              </p>
              <button 
                className="w-full px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                onClick={() => navigate('/recent')}
              >
                View Recent
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default UploadPage;
