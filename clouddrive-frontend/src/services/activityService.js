// Activity Tracking Service - Monitor and track all user activities
class ActivityService {
  constructor() {
    this.ACTIVITY_KEY = 'clouddrive_activities';
    this.RECENT_FILES_KEY = 'clouddrive_recent_files';
    this.SEARCH_HISTORY_KEY = 'clouddrive_search_history';
    this.activities = this.loadActivities();
    this.recentFiles = this.loadRecentFiles();
    this.searchHistory = this.loadSearchHistory();
    this.listeners = new Set();
  }

  // Load activities from localStorage
  loadActivities() {
    try {
      const stored = localStorage.getItem(this.ACTIVITY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  // Save activities to localStorage
  saveActivities() {
    try {
      localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(this.activities));
      return true;
    } catch (error) {
      console.error('Error saving activities:', error);
      return false;
    }
  }

  // Load recent files
  loadRecentFiles() {
    try {
      const stored = localStorage.getItem(this.RECENT_FILES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent files:', error);
      return [];
    }
  }

  // Save recent files
  saveRecentFiles() {
    try {
      localStorage.setItem(this.RECENT_FILES_KEY, JSON.stringify(this.recentFiles));
      return true;
    } catch (error) {
      console.error('Error saving recent files:', error);
      return false;
    }
  }

  // Load search history
  loadSearchHistory() {
    try {
      const stored = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }

  // Save search history
  saveSearchHistory() {
    try {
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory));
      return true;
    } catch (error) {
      console.error('Error saving search history:', error);
      return false;
    }
  }

  // Log user activity
  logActivity(type, details, metadata = {}) {
    const activity = {
      id: Date.now() + Math.random(),
      type,
      details,
      metadata,
      timestamp: new Date().toISOString(),
      userId: 'current-user', // TODO: Get from auth context
      sessionId: this.getSessionId()
    };

    this.activities.unshift(activity);
    
    // Keep only last 500 activities to prevent storage bloat
    if (this.activities.length > 500) {
      this.activities = this.activities.slice(0, 500);
    }

    this.saveActivities();
    this.notifyListeners('activity', activity);
    
    return activity;
  }

  // Track file access
  trackFileAccess(file, action = 'open') {
    // Update recent files
    this.updateRecentFiles(file);
    
    // Log activity
    this.logActivity('file_access', {
      action,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileId: file.id,
      filePath: file.path || '/'
    }, {
      category: 'file_operations',
      priority: 'normal'
    });
  }

  // Track file operations
  trackFileOperation(operation, file, details = {}) {
    this.logActivity('file_operation', {
      operation, // upload, download, delete, rename, move, copy
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileId: file.id,
      ...details
    }, {
      category: 'file_operations',
      priority: operation === 'delete' ? 'high' : 'normal'
    });
  }

  // Track sharing activity
  trackSharingActivity(file, shareType, recipients = []) {
    this.logActivity('sharing', {
      action: shareType, // share_link, share_user, share_public
      fileName: file.name,
      fileId: file.id,
      recipients,
      shareType: file.type || 'file'
    }, {
      category: 'collaboration',
      priority: 'normal'
    });
  }

  // Track collaboration activity
  trackCollaborationActivity(activity, file, user, details = {}) {
    this.logActivity('collaboration', {
      activity, // comment, edit, view, download
      fileName: file.name,
      fileId: file.id,
      collaborator: user,
      ...details
    }, {
      category: 'collaboration',
      priority: 'normal'
    });
  }

  // Track search activity
  trackSearchActivity(query, results = [], filters = {}) {
    // Update search history
    this.updateSearchHistory(query);
    
    // Log activity
    this.logActivity('search', {
      query,
      resultCount: results.length,
      filters,
      searchTime: new Date().toISOString()
    }, {
      category: 'search',
      priority: 'low'
    });
  }

  // Update recent files
  updateRecentFiles(file) {
    const recentFile = {
      id: file.id,
      name: file.name,
      type: file.type || 'file',
      size: file.size || 0,
      modified: file.modified || new Date().toISOString(),
      path: file.path || '/',
      thumbnail: file.thumbnail || null,
      lastAccessed: new Date().toISOString()
    };

    // Remove existing entry
    this.recentFiles = this.recentFiles.filter(f => f.id !== file.id);
    
    // Add to beginning
    this.recentFiles.unshift(recentFile);
    
    // Keep only last 20 recent files
    if (this.recentFiles.length > 20) {
      this.recentFiles = this.recentFiles.slice(0, 20);
    }

    this.saveRecentFiles();
    this.notifyListeners('recent_files', this.recentFiles);
  }

  // Update search history
  updateSearchHistory(query) {
    if (!query || query.trim().length < 2) return;
    
    const searchEntry = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultCount: 0 // Will be updated by search component
    };

    // Remove existing entry
    this.searchHistory = this.searchHistory.filter(h => h.query !== query);
    
    // Add to beginning
    this.searchHistory.unshift(searchEntry);
    
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(0, 50);
    }

    this.saveSearchHistory();
    this.notifyListeners('search_history', this.searchHistory);
  }

  // Get activities with filtering
  getActivities(filters = {}) {
    let filtered = [...this.activities];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(activity => activity.metadata.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(activity => new Date(activity.timestamp) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(activity => new Date(activity.timestamp) <= toDate);
    }

    // Filter by user
    if (filters.userId) {
      filtered = filtered.filter(activity => activity.userId === filters.userId);
    }

    // Limit results
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  // Get recent files
  getRecentFiles(limit = 10) {
    return this.recentFiles.slice(0, limit);
  }

  // Get search history
  getSearchHistory(limit = 20) {
    return this.searchHistory.slice(0, limit);
  }

  // Get activity statistics
  getActivityStats(timeRange = '7d') {
    const now = new Date();
    let cutoffDate;

    switch (timeRange) {
      case '1d':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const recentActivities = this.activities.filter(activity => 
      new Date(activity.timestamp) >= cutoffDate
    );

    const stats = {
      totalActivities: recentActivities.length,
      fileOperations: recentActivities.filter(a => a.type === 'file_operation').length,
      fileAccess: recentActivities.filter(a => a.type === 'file_access').length,
      sharing: recentActivities.filter(a => a.type === 'sharing').length,
      collaboration: recentActivities.filter(a => a.type === 'collaboration').length,
      searches: recentActivities.filter(a => a.type === 'search').length,
      mostActiveDay: this.getMostActiveDay(recentActivities),
      topFiles: this.getTopAccessedFiles(recentActivities),
      topSearches: this.getTopSearches(recentActivities)
    };

    return stats;
  }

  // Get most active day
  getMostActiveDay(activities) {
    const dayCounts = {};
    
    activities.forEach(activity => {
      const day = new Date(activity.timestamp).toDateString();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const mostActiveDay = Object.keys(dayCounts).reduce((a, b) => 
      dayCounts[a] > dayCounts[b] ? a : b
    );

    return {
      date: mostActiveDay,
      count: dayCounts[mostActiveDay] || 0
    };
  }

  // Get top accessed files
  getTopAccessedFiles(activities, limit = 5) {
    const fileCounts = {};
    
    activities.forEach(activity => {
      if (activity.details.fileId) {
        const fileId = activity.details.fileId;
        fileCounts[fileId] = (fileCounts[fileId] || 0) + 1;
      }
    });

    return Object.entries(fileCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([fileId, count]) => ({
        fileId,
        count,
        file: this.recentFiles.find(f => f.id === fileId)
      }));
  }

  // Get top searches
  getTopSearches(activities, limit = 5) {
    const searchCounts = {};
    
    activities.forEach(activity => {
      if (activity.type === 'search' && activity.details.query) {
        const query = activity.details.query;
        searchCounts[query] = (searchCounts[query] || 0) + 1;
      }
    });

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  // Clear activities
  clearActivities() {
    this.activities = [];
    this.saveActivities();
    this.notifyListeners('activities_cleared', null);
  }

  // Clear recent files
  clearRecentFiles() {
    this.recentFiles = [];
    this.saveRecentFiles();
    this.notifyListeners('recent_files_cleared', null);
  }

  // Clear search history
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
    this.notifyListeners('search_history_cleared', null);
  }

  // Export activities
  exportActivities() {
    const exportData = {
      exportDate: new Date().toISOString(),
      activities: this.activities,
      recentFiles: this.recentFiles,
      searchHistory: this.searchHistory,
      stats: this.getActivityStats()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Event listener management
  addListener(event, callback) {
    this.listeners.add({ event, callback });
  }

  removeListener(event, callback) {
    this.listeners.forEach(listener => {
      if (listener.event === event && listener.callback === callback) {
        this.listeners.delete(listener);
      }
    });
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('clouddrive_session_id');
    if (!sessionId) {
      sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('clouddrive_session_id', sessionId);
    }
    return sessionId;
  }

  // Cleanup old activities
  cleanupOldActivities() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep 90 days
    
    const initialLength = this.activities.length;
    this.activities = this.activities.filter(activity => 
      new Date(activity.timestamp) >= cutoffDate
    );

    if (this.activities.length < initialLength) {
      this.saveActivities();
      console.log(`Cleaned up ${initialLength - this.activities.length} old activities`);
    }
    
    return initialLength - this.activities.length;
  }
}

// Create singleton instance
const activityService = new ActivityService();

export default activityService;
