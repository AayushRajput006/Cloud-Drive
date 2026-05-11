// Share Management Service - Handle file sharing, permissions, and collaboration
import api from './api';

class ShareService {
  constructor() {
    this.SHARED_FILES_KEY = 'clouddrive_shared_files';
    this.SHARE_SETTINGS_KEY = 'clouddrive_share_settings';
    this.SHARE_ANALYTICS_KEY = 'clouddrive_share_analytics';
    this.sharedFiles = this.loadSharedFiles();
    this.shareSettings = this.loadShareSettings();
    this.shareAnalytics = this.loadShareAnalytics();
    this.listeners = new Set();
    this.useBackend = false; // Set to true when backend is available
  }

  // =========================
  // Data Loading & Saving
  // =========================
  loadSharedFiles() {
    try {
      const stored = localStorage.getItem(this.SHARED_FILES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading shared files:', error);
      return [];
    }
  }

  saveSharedFiles() {
    try {
      localStorage.setItem(this.SHARED_FILES_KEY, JSON.stringify(this.sharedFiles));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error saving shared files:', error);
      return false;
    }
  }

  loadShareSettings() {
    try {
      const stored = localStorage.getItem(this.SHARE_SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading share settings:', error);
      return {};
    }
  }

  saveShareSettings() {
    try {
      localStorage.setItem(this.SHARE_SETTINGS_KEY, JSON.stringify(this.shareSettings));
      return true;
    } catch (error) {
      console.error('Error saving share settings:', error);
      return false;
    }
  }

  loadShareAnalytics() {
    try {
      const stored = localStorage.getItem(this.SHARE_ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading share analytics:', error);
      return {};
    }
  }

  saveShareAnalytics() {
    try {
      localStorage.setItem(this.SHARE_ANALYTICS_KEY, JSON.stringify(this.shareAnalytics));
      return true;
    } catch (error) {
      console.error('Error saving share analytics:', error);
      return false;
    }
  }

  // =========================
  // Share Management
  // =========================
  async shareFile(fileId, shareData) {
    if (this.useBackend) {
      try {
        const response = await api.post('/share', {
          fileId,
          ...shareData
        });
        const backendShare = response.data;
        
        // Sync with localStorage
        const share = this.convertBackendShare(backendShare);
        this.sharedFiles.push(share);
        this.shareSettings[share.id] = share.shareSettings;
        this.shareAnalytics[share.id] = {
          accessLog: [],
          downloadLog: [],
          totalViews: 0,
          totalDownloads: 0,
          uniqueVisitors: new Set()
        };
        this.saveSharedFiles();
        this.saveShareSettings();
        this.saveShareAnalytics();
        
        return share;
      } catch (error) {
        console.error('Backend share failed, using localStorage:', error);
        return this.shareFileLocal(fileId, shareData);
      }
    }
    
    return this.shareFileLocal(fileId, shareData);
  }

  shareFileLocal(fileId, shareData) {
    const shareId = this.generateShareId();
    const shareCode = this.generateShareCode();
    
    const newShare = {
      id: shareId,
      fileId: fileId,
      fileName: shareData.fileName || 'Unnamed File',
      fileSize: shareData.fileSize || 0,
      fileType: shareData.fileType || 'unknown',
      sharedBy: {
        userId: shareData.sharedBy?.userId || 'current-user',
        name: shareData.sharedBy?.name || 'Current User',
        email: shareData.sharedBy?.email || 'user@example.com'
      },
      shareType: shareData.shareType || 'link', // link, email, public
      permissions: shareData.permissions || {
        view: true,
        edit: false,
        download: true,
        reshare: false
      },
      shareLink: this.generateShareLink(shareCode),
      shareCode: shareCode,
      shareSettings: {
        password: shareData.password || null,
        passwordValue: shareData.passwordValue || null,
        expiresAt: shareData.expiresAt || null,
        downloadLimit: shareData.downloadLimit || null,
        isActive: true
      },
      sharedWith: shareData.sharedWith || [],
      createdAt: new Date().toISOString(),
      expiresAt: shareData.expiresAt || null,
      accessCount: 0,
      downloadCount: 0,
      isActive: true
    };

    this.sharedFiles.push(newShare);
    this.shareSettings[shareId] = newShare.shareSettings;
    this.shareAnalytics[shareId] = {
      accessLog: [],
      downloadLog: [],
      totalViews: 0,
      totalDownloads: 0,
      uniqueVisitors: new Set()
    };

    this.saveSharedFiles();
    this.saveShareSettings();
    this.saveShareAnalytics();

    return newShare;
  }

  convertBackendShare(backendShare) {
    return {
      id: backendShare.id,
      fileId: backendShare.fileId,
      fileName: backendShare.fileName,
      fileSize: backendShare.fileSize,
      fileType: backendShare.fileType,
      sharedBy: backendShare.sharedBy,
      shareType: backendShare.shareType,
      permissions: backendShare.permissions,
      shareLink: backendShare.shareLink,
      shareCode: backendShare.shareCode,
      shareSettings: backendShare.shareSettings,
      sharedWith: backendShare.sharedWith || [],
      createdAt: backendShare.createdAt,
      expiresAt: backendShare.expiresAt,
      accessCount: backendShare.accessCount || 0,
      downloadCount: backendShare.downloadCount || 0,
      isActive: backendShare.isActive
    };
  }

  async getSharedFiles() {
    if (this.useBackend) {
      try {
        const response = await api.get('/share');
        const backendShares = response.data;
        
        // Sync with localStorage
        this.sharedFiles = backendShares.map(share => this.convertBackendShare(share));
        this.saveSharedFiles();
        
        return this.sharedFiles.filter(share => share.isActive);
      } catch (error) {
        console.error('Backend get shared files failed, using localStorage:', error);
        return this.sharedFiles.filter(share => share.isActive);
      }
    }
    
    return this.sharedFiles.filter(share => share.isActive);
  }

  getSharedByMe() {
    return this.sharedFiles.filter(share => 
      share.isActive && share.sharedBy.userId === 'current-user'
    );
  }

  getSharedWithMe() {
    // In a real app, this would check against the current user's ID
    // For now, return mock data
    return this.sharedFiles.filter(share => 
      share.isActive && share.shareType === 'public'
    );
  }

  getShareById(shareId) {
    return this.sharedFiles.find(share => share.id === shareId);
  }

  getShareByCode(shareCode) {
    return this.sharedFiles.find(share => share.shareCode === shareCode);
  }

  async updateShareSettings(shareId, settings) {
    if (this.useBackend) {
      try {
        const response = await api.put(`/share/${shareId}`, settings);
        const updatedShare = this.convertBackendShare(response.data);
        
        // Update local state
        const index = this.sharedFiles.findIndex(s => s.id === shareId);
        if (index !== -1) {
          this.sharedFiles[index] = updatedShare;
          this.shareSettings[shareId] = updatedShare.shareSettings;
          this.saveSharedFiles();
          this.saveShareSettings();
        }
        
        return updatedShare;
      } catch (error) {
        console.error('Backend update settings failed, using localStorage:', error);
        return this.updateShareSettingsLocal(shareId, settings);
      }
    }
    
    return this.updateShareSettingsLocal(shareId, settings);
  }

  updateShareSettingsLocal(shareId, settings) {
    const share = this.getShareById(shareId);
    if (!share) return null;

    Object.assign(share.shareSettings, settings);
    this.shareSettings[shareId] = share.shareSettings;
    this.saveSharedFiles();
    this.saveShareSettings();

    return share;
  }

  async revokeShare(shareId) {
    if (this.useBackend) {
      try {
        await api.delete(`/share/${shareId}`);
        return this.revokeShareLocal(shareId);
      } catch (error) {
        console.error('Backend revoke share failed, using localStorage:', error);
        return this.revokeShareLocal(shareId);
      }
    }
    
    return this.revokeShareLocal(shareId);
  }

  revokeShareLocal(shareId) {
    const share = this.getShareById(shareId);
    if (!share) return false;

    share.isActive = false;
    share.shareSettings.isActive = false;
    this.saveSharedFiles();
    this.saveShareSettings();

    return true;
  }

  // =========================
  // Share Link Management
  // =========================
  generateShareCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  generateShareId() {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateShareLink(shareCode) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/${shareCode}`;
  }

  validateShareLink(shareCode, password = null) {
    const share = this.getShareByCode(shareCode);
    
    if (!share || !share.isActive) {
      return { valid: false, reason: 'Share not found or inactive' };
    }

    if (share.shareSettings.expiresAt && new Date(share.shareSettings.expiresAt) < new Date()) {
      return { valid: false, reason: 'Share has expired' };
    }

    if (share.shareSettings.passwordValue) {
      if (!password || password !== share.shareSettings.passwordValue) {
        return { valid: false, reason: 'Invalid password' };
      }
    }

    if (share.shareSettings.downloadLimit && share.downloadCount >= share.shareSettings.downloadLimit) {
      return { valid: false, reason: 'Download limit reached' };
    }

    return { valid: true, share };
  }

  // =========================
  // Analytics & Tracking
  // =========================
  trackShareAccess(shareId, visitorInfo = {}) {
    const analytics = this.shareAnalytics[shareId];
    if (!analytics) return;

    const accessRecord = {
      timestamp: new Date().toISOString(),
      visitorId: visitorInfo.visitorId || 'unknown',
      ipAddress: visitorInfo.ipAddress || 'unknown',
      userAgent: visitorInfo.userAgent || 'unknown',
      device: visitorInfo.device || 'unknown',
      location: visitorInfo.location || 'unknown'
    };

    analytics.accessLog.push(accessRecord);
    analytics.totalViews++;
    analytics.uniqueVisitors.add(visitorInfo.visitorId || 'unknown');

    const share = this.getShareById(shareId);
    if (share) {
      share.accessCount++;
    }

    this.saveShareAnalytics();
    this.saveSharedFiles();
  }

  trackShareDownload(shareId, visitorInfo = {}) {
    const analytics = this.shareAnalytics[shareId];
    if (!analytics) return;

    const downloadRecord = {
      timestamp: new Date().toISOString(),
      visitorId: visitorInfo.visitorId || 'unknown',
      ipAddress: visitorInfo.ipAddress || 'unknown',
      userAgent: visitorInfo.userAgent || 'unknown'
    };

    analytics.downloadLog.push(downloadRecord);
    analytics.totalDownloads++;

    const share = this.getShareById(shareId);
    if (share) {
      share.downloadCount++;
    }

    this.saveShareAnalytics();
    this.saveSharedFiles();
  }

  getShareAnalytics(shareId) {
    const analytics = this.shareAnalytics[shareId];
    if (!analytics) return null;

    return {
      totalViews: analytics.totalViews,
      totalDownloads: analytics.totalDownloads,
      uniqueVisitors: analytics.uniqueVisitors.size,
      accessLog: analytics.accessLog,
      downloadLog: analytics.downloadLog,
      recentActivity: analytics.accessLog.slice(-10)
    };
  }

  // =========================
  // Collaboration
  // =========================
  addCollaborator(shareId, collaborator) {
    const share = this.getShareById(shareId);
    if (!share) return null;

    const newCollaborator = {
      userId: collaborator.userId || `user_${Date.now()}`,
      name: collaborator.name,
      email: collaborator.email,
      permissions: collaborator.permissions || { view: true, edit: false, download: true },
      addedAt: new Date().toISOString()
    };

    share.sharedWith.push(newCollaborator);
    this.saveSharedFiles();

    return newCollaborator;
  }

  removeCollaborator(shareId, userId) {
    const share = this.getShareById(shareId);
    if (!share) return false;

    share.sharedWith = share.sharedWith.filter(c => c.userId !== userId);
    this.saveSharedFiles();

    return true;
  }

  updateCollaboratorPermissions(shareId, userId, permissions) {
    const share = this.getShareById(shareId);
    if (!share) return null;

    const collaborator = share.sharedWith.find(c => c.userId === userId);
    if (!collaborator) return null;

    collaborator.permissions = permissions;
    this.saveSharedFiles();

    return collaborator;
  }

  // =========================
  // Event Listeners
  // =========================
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.sharedFiles));
  }

  // =========================
  // Utility Functions
  // =========================
  getActiveShares() {
    return this.sharedFiles.filter(share => 
      share.isActive && 
      (!share.shareSettings.expiresAt || new Date(share.shareSettings.expiresAt) > new Date())
    );
  }

  getExpiredShares() {
    return this.sharedFiles.filter(share => 
      share.isActive && 
      share.shareSettings.expiresAt && 
      new Date(share.shareSettings.expiresAt) < new Date()
    );
  }

  getSharesByType(type) {
    return this.sharedFiles.filter(share => share.shareType === type && share.isActive);
  }

  clearExpiredShares() {
    const expired = this.getExpiredShares();
    expired.forEach(share => {
      share.isActive = false;
      share.shareSettings.isActive = false;
    });
    this.saveSharedFiles();
    this.saveShareSettings();
    return expired.length;
  }
}

const shareService = new ShareService();
export default shareService;
