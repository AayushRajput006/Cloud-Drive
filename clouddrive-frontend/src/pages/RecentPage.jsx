import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import FileGrid from '../components/FileGrid';
import ShareModal from '../components/ShareModal';

import activityService from '../services/activityService';
import fileService from '../services/fileService';
import shareService from '../services/shareService';

function RecentPage() {
  const [recentFiles, setRecentFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('lastAccessed');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [notification, setNotification] = useState(null);
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  
  const navigate = useNavigate();

  // =========================
  // Notifications
  // =========================
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // =========================
  // Load Recent Files
  // =========================
  const loadRecentFiles = useCallback(() => {
    try {
      setLoading(true);
      const recent = activityService.getRecentFiles();
      console.log('Recent files loaded:', recent);
      
      // Transform recent files to ensure they have the correct structure for FileGrid
      const transformedFiles = (recent || []).map((file, index) => ({
        id: file.id || file.fileId || `recent_${index}`,
        name: file.name || file.fileName || 'Unknown File',
        type: file.type || file.fileType || 'unknown',
        size: file.size || 0,
        createdAt: file.createdAt || new Date().toISOString(),
        modifiedAt: file.modifiedAt || file.lastAccessed || new Date().toISOString(),
        lastAccessed: file.lastAccessed || file.createdAt || new Date().toISOString()
      }));
      
      setRecentFiles(transformedFiles);
      console.log('Transformed files:', transformedFiles);
    } catch (error) {
      console.error('Error loading recent files:', error);
      // Set empty array to prevent crashes
      setRecentFiles([]);
      // Don't show notification on initial load
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadRecentFiles();
  }, [loadRecentFiles]);

  console.log('RecentPage render state:', { loading, recentFiles: recentFiles.length });

  // =========================
  // File Actions
  // =========================
  const handleFileAction = useCallback(async (action, fileOrFiles) => {
    const fileArray = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

    try {
      switch (action) {
        case 'open':
          activityService.trackFileAccess(fileArray[0], 'open');
          navigate('/preview');
          break;
        case 'download':
          for (const file of fileArray) {
            await fileService.downloadFile(file.id);
            activityService.trackFileOperation('download', file, {
              timestamp: new Date().toISOString()
            });
          }
          showNotification('Download started');
          break;
        case 'share':
          if (fileArray.length === 1) {
            setShareFile(fileArray[0]);
            setShareModalOpen(true);
          }
          break;
        case 'delete':
          for (const file of fileArray) {
            await fileService.deleteFile(file.id);
            activityService.trackFileOperation('delete', file, {
              timestamp: new Date().toISOString()
            });
          }
          loadRecentFiles();
          showNotification('Files deleted successfully');
          break;
        default:
          console.log('Action:', action);
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'No authentication token found') {
        showNotification('Please log in to perform this action', 'error');
        navigate('/login');
      } else {
        showNotification(err.message || 'Operation failed', 'error');
      }
    }
  }, [loadRecentFiles, navigate, showNotification]);

  // =========================
  // Share Handler
  // =========================
  const handleShare = useCallback(async (shareData) => {
    try {
      await shareService.shareFile(shareData.fileId, shareData);
      activityService.trackFileOperation('share', shareFile, {
        timestamp: new Date().toISOString()
      });
      showNotification('File shared successfully');
    } catch (error) {
      console.error('Share failed:', error);
      if (error.message === 'No authentication token found') {
        showNotification('Please log in to share files', 'error');
        navigate('/login');
      } else {
        showNotification('Failed to share file', 'error');
      }
    }
  }, [shareFile, showNotification, navigate]);

  // =========================
  // Filter & Search
  // =========================
  const filteredFiles = recentFiles.filter(file => {
    const matchesSearch = file.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    
    let matchesTime = true;
    if (filterTime !== 'all') {
      const now = new Date();
      const fileDate = new Date(file.lastAccessed || file.createdAt);
      const diffDays = Math.floor((now - fileDate) / (1000 * 60 * 60 * 24));
      
      switch (filterTime) {
        case 'today':
          matchesTime = diffDays === 0;
          break;
        case 'week':
          matchesTime = diffDays <= 7;
          break;
        case 'month':
          matchesTime = diffDays <= 30;
          break;
        default:
          matchesTime = true;
      }
    }
    
    return matchesSearch && matchesType && matchesTime;
  });

  // =========================
  // Sort
  // =========================
  const sortedFiles = useCallback(() => {
    const sorted = [...filteredFiles];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sorted.sort((a, b) => b.size - a.size);
      case 'lastAccessed':
        return sorted.sort((a, b) => new Date(b.lastAccessed || b.createdAt) - new Date(a.lastAccessed || a.createdAt));
      case 'modified':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  }, [filteredFiles, sortBy]);

  // =========================
  // Statistics
  // =========================
  const getStatistics = useCallback(() => {
    const totalFiles = recentFiles.length;
    const today = new Date();
    const todayFiles = recentFiles.filter(f => {
      const fileDate = new Date(f.lastAccessed || f.createdAt);
      return Math.floor((today - fileDate) / (1000 * 60 * 60 * 24)) === 0;
    }).length;
    const weekFiles = recentFiles.filter(f => {
      const fileDate = new Date(f.lastAccessed || f.createdAt);
      return Math.floor((today - fileDate) / (1000 * 60 * 60 * 24)) <= 7;
    }).length;
    
    const typeCounts = recentFiles.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {});

    return { totalFiles, todayFiles, weekFiles, typeCounts };
  }, [recentFiles]);

  const stats = getStatistics();

  // =========================
  // Keyboard Shortcuts
  // =========================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            document.querySelector('input[type="text"]')?.focus();
            break;
          case 'a':
            e.preventDefault();
            setSelectedFiles(new Set(recentFiles.map(f => f.id)));
            break;
          case 'd':
            e.preventDefault();
            if (selectedFiles.size > 0) {
              handleFileAction('delete', Array.from(selectedFiles).map(id => recentFiles.find(f => f.id === id)));
              setSelectedFiles(new Set());
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recentFiles, selectedFiles, handleFileAction]);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleViewModeChange = useCallback((newViewMode) => {
    setViewMode(newViewMode);
  }, []);

  return (
    <AppShell sidebar={<DriveSidebar active="Recent" />} topbar={<DriveTopbar title="Recent Files" />}>
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

      <div className="p-lg">
        <div className="max-w-7xl mx-auto">
          {/* Header with Controls */}
          <div className="flex flex-col lg:flex-row justify-between gap-lg mb-xl">
            <h1 className="text-3xl font-bold">
              Recent Files
            </h1>

            <div className="flex flex-wrap gap-md items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Search recent files... (Ctrl+F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-lg px-md py-sm w-72"
              />

              {/* Filter by Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-lg px-md py-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
              </select>

              {/* Filter by Time */}
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="border rounded-lg px-md py-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-md py-sm"
              >
                <option value="lastAccessed">Last Accessed</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="modified">Modified</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Total Files</p>
              <p className="text-2xl font-bold text-primary">{stats.totalFiles}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Today</p>
              <p className="text-2xl font-bold text-success">{stats.todayFiles}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">This Week</p>
              <p className="text-2xl font-bold text-tertiary">{stats.weekFiles}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">File Types</p>
              <p className="text-2xl font-bold text-secondary">{Object.keys(stats.typeCounts).length}</p>
            </div>
          </div>

          {/* Recent Files */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : sortedFiles().length === 0 ? (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">
                history
              </span>
              <h3 className="text-xl font-semibold mb-sm">No recent files</h3>
              <p className="text-on-surface-variant mb-md">
                Files you've recently accessed will appear here
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-md py-sm bg-primary text-white rounded-lg hover:bg-primary-container transition-colors"
              >
                Go to My Files
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-on-surface-variant mb-md">
                {sortedFiles().length} {sortedFiles().length === 1 ? 'file' : 'files'}
              </div>

              <FileGrid
                files={sortedFiles()}
                viewMode={viewMode}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                onViewModeChange={handleViewModeChange}
                onFileSelect={(file) => handleFileAction('open', file)}
                onFileAction={handleFileAction}
              />
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareFile && (
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
    </AppShell>
  );
}

export default RecentPage;
