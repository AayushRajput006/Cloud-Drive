import { useState, useEffect } from 'react';
import activityService from '../services/activityService';

function RecentActivityPanel({ isOpen, onClose, onFileSelect, onActivityAction }) {
  const [activities, setActivities] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('activities');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    timeRange: '7d'
  });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, filters]);

  useEffect(() => {
    // Set up activity listener
    const handleActivityUpdate = (data) => {
      if (activeTab === 'activities') {
        loadData();
      }
    };

    const handleRecentFilesUpdate = (data) => {
      if (activeTab === 'recent') {
        setRecentFiles(data);
      }
    };

    const handleSearchHistoryUpdate = (data) => {
      if (activeTab === 'search') {
        setSearchHistory(data);
      }
    };

    activityService.addListener('activity', handleActivityUpdate);
    activityService.addListener('recent_files', handleRecentFilesUpdate);
    activityService.addListener('search_history', handleSearchHistoryUpdate);

    return () => {
      activityService.removeListener('activity', handleActivityUpdate);
      activityService.removeListener('recent_files', handleRecentFilesUpdate);
      activityService.removeListener('search_history', handleSearchHistoryUpdate);
    };
  }, [activeTab]);

  const loadData = () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'activities':
          const activityFilters = filters.type === 'all' ? 
            { category: filters.category === 'all' ? undefined : filters.category, limit: 50 } :
            { type: filters.type, limit: 50 };
          const loadedActivities = activityService.getActivities(activityFilters);
          setActivities(loadedActivities);
          break;
          
        case 'recent':
          const loadedRecentFiles = activityService.getRecentFiles(20);
          setRecentFiles(loadedRecentFiles);
          break;
          
        case 'search':
          const loadedSearchHistory = activityService.getSearchHistory(30);
          setSearchHistory(loadedSearchHistory);
          break;
      }

      // Load stats
      const activityStats = activityService.getActivityStats(filters.timeRange);
      setStats(activityStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = (file) => {
    onFileSelect?.(file);
    activityService.trackFileAccess(file, 'open');
  };

  const handleSearchHistoryClick = (searchEntry) => {
    // Trigger search with historical query
    onActivityAction?.('search', searchEntry.query);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear this data? This action cannot be undone.')) {
      switch (activeTab) {
        case 'activities':
          activityService.clearActivities();
          break;
        case 'recent':
          activityService.clearRecentFiles();
          break;
        case 'search':
          activityService.clearSearchHistory();
          break;
      }
      loadData();
    }
  };

  const handleExportData = () => {
    activityService.exportActivities();
  };

  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'file_access':
        return 'folder_open';
      case 'file_operation':
        switch (activity.details.operation) {
          case 'upload': return 'upload';
          case 'download': return 'download';
          case 'delete': return 'delete';
          case 'rename': return 'edit';
          case 'move': return 'drive_file_move';
          case 'copy': return 'content_copy';
          default: return 'description';
        }
      case 'sharing':
        return 'share';
      case 'collaboration':
        return 'groups';
      case 'search':
        return 'search';
      default:
        return 'info';
    }
  };

  const getActivityColor = (activity) => {
    switch (activity.type) {
      case 'file_operation':
        return activity.details.operation === 'delete' ? 'text-error' : 'text-primary';
      case 'sharing':
        return 'text-secondary';
      case 'collaboration':
        return 'text-tertiary';
      default:
        return 'text-on-surface';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-6xl h-full mx-auto my-4 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">recent_actors</span>
            <div>
              <h2 className="text-h2 text-h2">Recent Activity</h2>
              <p className="text-body-sm text-on-surface-variant">
                Track your recent files, searches, and activities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="p-2 hover:bg-surface-container-low rounded-lg"
              title="Export activity data"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
            <button
              onClick={handleClearData}
              className="p-2 hover:bg-surface-container-low rounded-lg text-error"
              title="Clear data"
            >
              <span className="material-symbols-outlined">clear_all</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'activities' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'recent' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Recent Files
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'search' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Search History
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'activities' && (
          <div className="flex items-center gap-4 p-4 border-b border-outline-variant bg-surface-container-low">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-outline-variant rounded-lg text-body-sm"
            >
              <option value="all">All Activities</option>
              <option value="file_access">File Access</option>
              <option value="file_operation">File Operations</option>
              <option value="sharing">Sharing</option>
              <option value="collaboration">Collaboration</option>
              <option value="search">Searches</option>
            </select>

            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className="px-3 py-2 border border-outline-variant rounded-lg text-body-sm"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Statistics */}
              {stats && activeTab === 'activities' && (
                <div className="p-4 bg-surface-container-low border-b border-outline-variant">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.totalActivities}</div>
                      <div className="text-sm text-on-surface-variant">Total Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{stats.fileOperations}</div>
                      <div className="text-sm text-on-surface-variant">File Operations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-tertiary">{stats.sharing}</div>
                      <div className="text-sm text-on-surface-variant">Sharing Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">{stats.searches}</div>
                      <div className="text-sm text-on-surface-variant">Searches</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <div className="p-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                        history
                      </span>
                      <h3 className="text-h3 text-h3 mb-2">No activities found</h3>
                      <p className="text-body-md text-on-surface-variant">
                        Start using your cloud drive to see your activity here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors"
                        >
                          <div className={`p-2 rounded-full bg-surface-container-low`}>
                            <span className={`material-symbols-outlined text-lg ${getActivityColor(activity)}`}>
                              {getActivityIcon(activity)}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-body-sm font-medium text-on-surface">
                                {activity.details.fileName || activity.details.query || activity.type}
                              </h4>
                              <span className="text-xs text-on-surface-variant">
                                {formatRelativeTime(activity.timestamp)}
                              </span>
                            </div>
                            
                            <p className="text-body-sm text-on-surface-variant">
                              {activity.details.action && (
                                <span>Activity: {activity.details.action}</span>
                              )}
                              {activity.details.operation && (
                                <span>Operation: {activity.details.operation}</span>
                              )}
                              {activity.details.query && (
                                <span>Search: "{activity.details.query}"</span>
                              )}
                              {activity.details.recipients && activity.details.recipients.length > 0 && (
                                <span>Shared with {activity.details.recipients.length} people</span>
                              )}
                            </p>
                            
                            {activity.details.fileSize && (
                              <p className="text-xs text-on-surface-variant">
                                Size: {formatFileSize(activity.details.fileSize)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Files Tab */}
              {activeTab === 'recent' && (
                <div className="p-4">
                  {recentFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                        folder_open
                      </span>
                      <h3 className="text-h3 text-h3 mb-2">No recent files</h3>
                      <p className="text-body-md text-on-surface-variant">
                        Start accessing files to see them here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {recentFiles.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => handleFileClick(file)}
                          className="bg-white border border-outline-variant rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-lg bg-primary-container-low flex items-center justify-center mb-3">
                              <span className="material-symbols-outlined text-2xl text-primary">
                                {file.type === 'image' ? 'image' : 'file_present'}
                              </span>
                            </div>
                            
                            <h4 className="text-body-sm font-medium text-center truncate w-full mb-1">
                              {file.name}
                            </h4>
                            
                            <p className="text-xs text-on-surface-variant text-center">
                              {formatFileSize(file.size)}
                            </p>
                            
                            <p className="text-xs text-on-surface-variant text-center">
                              {formatRelativeTime(file.lastAccessed)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Search History Tab */}
              {activeTab === 'search' && (
                <div className="p-4">
                  {searchHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                        search
                      </span>
                      <h3 className="text-h3 text-h3 mb-2">No search history</h3>
                      <p className="text-body-md text-on-surface-variant">
                        Start searching to see your history here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchHistory.map((search, index) => (
                        <div
                          key={index}
                          onClick={() => handleSearchHistoryClick(search)}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-on-surface-variant">
                              search
                            </span>
                            <div>
                              <h4 className="text-body-sm font-medium text-on-surface">
                                {search.query}
                              </h4>
                              <p className="text-xs text-on-surface-variant">
                                {formatRelativeTime(search.timestamp)}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onActivityAction?.('search', search.query);
                            }}
                            className="p-2 hover:bg-surface-container rounded-lg"
                            title="Search again"
                          >
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentActivityPanel;
