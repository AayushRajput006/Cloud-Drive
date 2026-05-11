import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AppShell from "../components/AppShell";
import DriveSidebar from "../components/DriveSidebar";
import DriveTopbar from "../components/DriveTopbar";
import FileGrid from "../components/FileGrid";
import ShareSettingsModal from "../components/ShareSettingsModal";
import ShareLinkCard from "../components/ShareLinkCard";
import ShareAnalytics from "../components/ShareAnalytics";

import shareService from "../services/shareService";
import activityService from "../services/activityService";

function SharedPage() {
  const navigate = useNavigate();

  const [sharedByMe, setSharedByMe] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [activeTab, setActiveTab] = useState('shared-by-me');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPermission, setFilterPermission] = useState('all');
  
  const [selectedShare, setSelectedShare] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Shared Files
  // =========================
  const loadSharedFiles = useCallback(() => {
    try {
      setLoading(true);
      const sharedBy = shareService.getSharedByMe();
      const sharedWith = shareService.getSharedWithMe();
      setSharedByMe(sharedBy);
      setSharedWithMe(sharedWith);
    } catch (error) {
      console.error('Error loading shared files:', error);
      showNotification('Failed to load shared files', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSharedFiles();

    // Subscribe to share service updates
    const unsubscribe = shareService.subscribe(() => {
      loadSharedFiles();
    });

    return () => unsubscribe();
  }, [loadSharedFiles]);

  // =========================
  // Filter & Search
  // =========================
  const filteredSharedByMe = sharedByMe.filter(share => {
    const matchesSearch = share.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || share.shareType === filterType;
    const matchesPermission = filterPermission === 'all' || 
      (filterPermission === 'view' && share.permissions.view) ||
      (filterPermission === 'edit' && share.permissions.edit) ||
      (filterPermission === 'download' && share.permissions.download);
    return matchesSearch && matchesType && matchesPermission;
  });

  const filteredSharedWithMe = sharedWithMe.filter(share => {
    const matchesSearch = share.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // =========================
  // Share Actions
  // =========================
  const handleManageShare = (share) => {
    setSelectedShare(share);
    setSettingsModalOpen(true);
  };

  const handleViewAnalytics = (share) => {
    setSelectedShare(share);
    setAnalyticsModalOpen(true);
  };

  const handleRevokeShare = (shareId) => {
    if (window.confirm('Are you sure you want to revoke this share?')) {
      shareService.revokeShare(shareId);
      activityService.trackFileOperation('share_revoke', { id: shareId, name: 'Shared File' }, {
        timestamp: new Date().toISOString()
      });
      loadSharedFiles();
      showNotification('Share revoked successfully');
    }
  };

  const handleCopyLink = (shareLink) => {
    navigator.clipboard.writeText(shareLink);
    showNotification('Share link copied to clipboard');
  };

  const handleUpdateSettings = (shareId, settings) => {
    shareService.updateShareSettings(shareId, settings);
    activityService.trackFileOperation('share_update', { id: shareId, name: 'Shared File' }, {
      timestamp: new Date().toISOString(),
      settings
    });
    loadSharedFiles();
    showNotification('Share settings updated');
  };

  // =========================
  // Convert Shares to File Format
  // =========================
  const convertSharesToFiles = (shares) => {
    return shares.map(share => ({
      id: share.id,
      name: share.fileName,
      type: share.fileType,
      size: share.fileSize,
      createdAt: share.createdAt,
      modifiedAt: share.createdAt,
      shareData: share,
      isShared: true
    }));
  };

  // =========================
  // Notifications
  // =========================
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // =========================
  // Statistics
  // =========================
  const getStatistics = () => {
    const activeShares = shareService.getActiveShares();
    const expiredShares = shareService.getExpiredShares();
    const totalViews = sharedByMe.reduce((sum, share) => sum + share.accessCount, 0);
    const totalDownloads = sharedByMe.reduce((sum, share) => sum + share.downloadCount, 0);

    return {
      totalShares: sharedByMe.length,
      activeShares: activeShares.length,
      expiredShares: expiredShares.length,
      totalViews,
      totalDownloads,
      receivedShares: sharedWithMe.length
    };
  };

  const stats = getStatistics();

  // =========================
  // Render
  // =========================
  return (
    <AppShell
      sidebar={<DriveSidebar active="Shared" />}
      topbar={<DriveTopbar title="Shared Files" />}
    >
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
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between gap-lg mb-xl">
            <h1 className="text-3xl font-bold">
              Shared Files
            </h1>

            <div className="flex flex-wrap gap-md items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Search shared files..."
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
                <option value="link">Link Shares</option>
                <option value="email">Email Shares</option>
                <option value="public">Public Shares</option>
              </select>

              {/* Filter by Permission */}
              {activeTab === 'shared-by-me' && (
                <select
                  value={filterPermission}
                  onChange={(e) => setFilterPermission(e.target.value)}
                  className="border rounded-lg px-md py-sm"
                >
                  <option value="all">All Permissions</option>
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                  <option value="download">Can Download</option>
                </select>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md mb-xl">
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Total Shares</p>
              <p className="text-2xl font-bold text-primary">{stats.totalShares}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Active</p>
              <p className="text-2xl font-bold text-success">{stats.activeShares}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Expired</p>
              <p className="text-2xl font-bold text-warning">{stats.expiredShares}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Total Views</p>
              <p className="text-2xl font-bold text-tertiary">{stats.totalViews}</p>
            </div>
            <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant">
              <p className="text-sm text-on-surface-variant">Downloads</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalDownloads}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-sm mb-lg border-b border-outline-variant">
            <button
              onClick={() => setActiveTab('shared-by-me')}
              className={`px-md py-sm font-medium ${
                activeTab === 'shared-by-me'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Shared by Me ({sharedByMe.length})
            </button>
            <button
              onClick={() => setActiveTab('shared-with-me')}
              className={`px-md py-sm font-medium ${
                activeTab === 'shared-with-me'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Shared with Me ({sharedWithMe.length})
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Shared by Me */}
              {activeTab === 'shared-by-me' && (
                <>
                  {filteredSharedByMe.length === 0 ? (
                    <div className="text-center py-xl">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">
                        share
                      </span>
                      <h3 className="text-xl font-semibold mb-sm">No files shared yet</h3>
                      <p className="text-on-surface-variant">
                        Share files with others to see them here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-md">
                      {filteredSharedByMe.map((share) => (
                        <ShareLinkCard
                          key={share.id}
                          share={share}
                          onManage={() => handleManageShare(share)}
                          onViewAnalytics={() => handleViewAnalytics(share)}
                          onRevoke={() => handleRevokeShare(share.id)}
                          onCopyLink={() => handleCopyLink(share.shareLink)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Shared with Me */}
              {activeTab === 'shared-with-me' && (
                <>
                  {filteredSharedWithMe.length === 0 ? (
                    <div className="text-center py-xl">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">
                        inbox
                      </span>
                      <h3 className="text-xl font-semibold mb-sm">No files shared with you</h3>
                      <p className="text-on-surface-variant">
                        When others share files with you, they'll appear here
                      </p>
                    </div>
                  ) : (
                    <FileGrid
                      files={convertSharesToFiles(filteredSharedWithMe)}
                      viewMode="grid"
                      sortBy="name"
                      onSortChange={() => {}}
                      onViewModeChange={() => {}}
                      onFileSelect={(file) => console.log('Selected:', file)}
                      onFileAction={(action, file) => console.log('Action:', action, file)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Share Settings Modal */}
      {selectedShare && (
        <ShareSettingsModal
          isOpen={settingsModalOpen}
          onClose={() => {
            setSettingsModalOpen(false);
            setSelectedShare(null);
          }}
          share={selectedShare}
          onUpdate={handleUpdateSettings}
        />
      )}

      {/* Share Analytics Modal */}
      {selectedShare && (
        <ShareAnalytics
          isOpen={analyticsModalOpen}
          onClose={() => {
            setAnalyticsModalOpen(false);
            setSelectedShare(null);
          }}
          share={selectedShare}
        />
      )}
    </AppShell>
  );
}

export default SharedPage;
