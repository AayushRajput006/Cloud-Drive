import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";
import FilePreview from "../components/FilePreview";
import { authService } from "../services/authService";

// Mock file data - replace with actual API call
const mockFile = {
  id: 1,
  name: "Q1 2024 Report.pdf",
  type: "pdf",
  size: 2048576,
  path: "/Documents/Work/",
  createdAt: "2026-05-08T10:00:00Z",
  modifiedAt: "2026-05-10T14:30:00Z",
  fileType: "application/pdf",
  owner: "John Doe"
};

function PreviewPage() {
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get file ID from URL params or state
    const fileId = location.state?.fileId || new URLSearchParams(location.search).get('id');
    
    if (fileId) {
      // TODO: Replace with actual API call
      // fetch(`/api/files/${fileId}`, {
      //   headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      // })
      // .then(response => response.json())
      // .then(data => setFile(data))
      // .catch(error => console.error('Failed to load file:', error));
      
      // Use mock data for now
      setFile(mockFile);
    } else {
      // No file ID provided, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleDownload = (fileToDownload) => {
    console.log('Downloading file:', fileToDownload);
    // TODO: Implement actual download
    // window.open(`/api/files/${fileToDownload.id}/download`, '_blank');
  };

  const handleShare = (fileToShare) => {
    console.log('Sharing file:', fileToShare);
    // TODO: Implement actual share functionality
    navigate('/share', { state: { files: [fileToShare] } });
  };

  const handleDelete = (fileToDelete) => {
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (confirmed) {
      console.log('Deleting file:', fileToDelete);
      // TODO: Implement actual delete
      navigate('/dashboard');
    }
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

  if (!file) {
    return (
      <AppShell sidebar={<DriveSidebar active="My Files" />} topbar={<DriveTopbar searchPlaceholder="Search..." />}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-3xl text-primary">description</span>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">Loading file...</h2>
            <p className="text-body-md text-on-surface-variant">
              Please wait while we load your file
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={<DriveSidebar active="My Files" />} topbar={<DriveTopbar searchPlaceholder="Search..." />}>
      <div className="flex h-full bg-surface-container-low">
        <div className="flex flex-col flex-1 relative min-w-0">
          <div className="flex justify-between items-center px-lg py-sm bg-surface border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <button
                onClick={() => handleDownload(file)}
                className="px-md py-1.5 bg-primary text-on-primary rounded-lg hover:bg-primary-hover"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download
              </button>
              <button
                onClick={() => handleShare(file)}
                className="px-md py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share
              </button>
              <button
                onClick={() => handleDelete(file)}
                className="px-md py-1.5 border border-error text-error rounded-lg hover:bg-error-container"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto flex justify-center p-xl items-start bg-[#f0f1f2]">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm min-h-[600px] flex items-center justify-center">
              {showPreview && (
                <FilePreview
                  file={file}
                  onClose={handleClose}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
        
        <aside className="hidden lg:flex flex-col w-80 bg-surface border-l border-outline-variant p-lg">
          <h3 className="text-h3 font-h3 text-on-surface mb-lg">File Details</h3>
          
          <div className="space-y-md">
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Name</h4>
              <p className="text-body-md text-on-surface-variant">{file.name}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Type</h4>
              <p className="text-body-md text-on-surface-variant capitalize">{file.type}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Size</h4>
              <p className="text-body-md text-on-surface-variant">{formatFileSize(file.size)}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Location</h4>
              <p className="text-body-md text-on-surface-variant">{file.path}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Created</h4>
              <p className="text-body-md text-on-surface-variant">{formatDate(file.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Modified</h4>
              <p className="text-body-md text-on-surface-variant">{formatDate(file.modifiedAt)}</p>
            </div>
            
            <div>
              <h4 className="font-h4 text-h4 text-on-surface mb-sm">Owner</h4>
              <p className="text-body-md text-on-surface-variant">{file.owner}</p>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export default PreviewPage;
