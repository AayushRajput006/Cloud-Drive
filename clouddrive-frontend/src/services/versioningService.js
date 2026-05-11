// File Versioning Service - Manage file versions and history
class VersioningService {
  constructor() {
    this.VERSIONS_KEY = 'clouddrive_file_versions';
    this.versions = this.loadVersions();
  }

  // Load versions from localStorage
  loadVersions() {
    try {
      const stored = localStorage.getItem(this.VERSIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading versions:', error);
      return {};
    }
  }

  // Save versions to localStorage
  saveVersions() {
    try {
      localStorage.setItem(this.VERSIONS_KEY, JSON.stringify(this.versions));
      return true;
    } catch (error) {
      console.error('Error saving versions:', error);
      return false;
    }
  }

  // Create new version for a file
  createVersion(file, content, changeDescription = '') {
    const fileId = file.id;
    const timestamp = new Date().toISOString();
    
    if (!this.versions[fileId]) {
      this.versions[fileId] = [];
    }

    const version = {
      id: Date.now() + Math.random(),
      fileId: fileId,
      fileName: file.name,
      fileSize: content?.length || file.size || 0,
      contentType: file.type || 'application/octet-stream',
      changeDescription,
      timestamp,
      versionNumber: this.versions[fileId].length + 1,
      author: 'Current User', // TODO: Get from auth context
      isCurrent: true,
      checksum: this.calculateChecksum(content)
    };

    // Mark previous versions as not current
    this.versions[fileId].forEach(v => {
      v.isCurrent = false;
    });

    // Add new version
    this.versions[fileId].unshift(version);
    
    // Keep only last 10 versions to prevent storage bloat
    if (this.versions[fileId].length > 10) {
      this.versions[fileId] = this.versions[fileId].slice(0, 10);
    }

    this.saveVersions();
    return version;
  }

  // Get all versions for a file
  getVersions(fileId) {
    return this.versions[fileId] || [];
  }

  // Get current version for a file
  getCurrentVersion(fileId) {
    const versions = this.versions[fileId] || [];
    return versions.find(v => v.isCurrent) || versions[0];
  }

  // Get specific version
  getVersion(fileId, versionId) {
    const versions = this.versions[fileId] || [];
    return versions.find(v => v.id === versionId);
  }

  // Restore to a specific version
  restoreVersion(fileId, versionId) {
    const versions = this.versions[fileId] || [];
    const versionToRestore = versions.find(v => v.id === versionId);
    
    if (!versionToRestore) {
      throw new Error('Version not found');
    }

    // Mark restored version as current
    versions.forEach(v => {
      v.isCurrent = v.id === versionId;
    });

    this.saveVersions();
    return versionToRestore;
  }

  // Delete a version
  deleteVersion(fileId, versionId) {
    if (!this.versions[fileId]) return false;

    const initialLength = this.versions[fileId].length;
    this.versions[fileId] = this.versions[fileId].filter(v => v.id !== versionId);
    
    // If we deleted the current version, mark the latest as current
    if (this.versions[fileId].length > 0) {
      const currentVersion = this.versions[fileId].find(v => v.isCurrent);
      if (!currentVersion) {
        this.versions[fileId][0].isCurrent = true;
      }
    }

    // Delete versions array if empty
    if (this.versions[fileId].length === 0) {
      delete this.versions[fileId];
    }

    this.saveVersions();
    return this.versions[fileId].length < initialLength;
  }

  // Compare two versions
  compareVersions(versionId1, versionId2) {
    const version1 = this.getVersion(null, versionId1);
    const version2 = this.getVersion(null, versionId2);
    
    if (!version1 || !version2) {
      return { error: 'One or both versions not found' };
    }

    const differences = {
      added: [],
      removed: [],
      modified: []
    };

    // Simple text comparison for now
    // TODO: Implement more sophisticated diff algorithm
    if (version1.checksum !== version2.checksum) {
      differences.modified.push({
        type: 'content',
        description: 'File content has changed'
      });
    }

    return differences;
  }

  // Get version history statistics
  getVersionStats(fileId) {
    const versions = this.versions[fileId] || [];
    
    if (versions.length === 0) {
      return {
        totalVersions: 0,
        totalSize: 0,
        oldestVersion: null,
        newestVersion: null,
        authors: []
      };
    }

    const authors = [...new Set(versions.map(v => v.author))];
    const totalSize = versions.reduce((sum, v) => sum + v.fileSize, 0);

    return {
      totalVersions: versions.length,
      totalSize,
      oldestVersion: versions[versions.length - 1],
      newestVersion: versions[0],
      authors,
      averageVersionsPerDay: this.calculateVersionsPerDay(fileId)
    };
  }

  // Calculate versions created per day
  calculateVersionsPerDay(fileId) {
    const versions = this.versions[fileId] || [];
    if (versions.length === 0) return 0;

    const oldestDate = new Date(versions[versions.length - 1].timestamp);
    const newestDate = new Date(versions[0].timestamp);
    const daysDiff = Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff > 0 ? (versions.length / daysDiff).toFixed(2) : versions.length;
  }

  // Calculate checksum for content integrity
  calculateChecksum(content) {
    if (!content) return '';
    
    // Simple checksum calculation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Export version history
  exportVersions(fileId) {
    const versions = this.versions[fileId] || [];
    const exportData = {
      fileId,
      exportDate: new Date().toISOString(),
      versions: versions,
      stats: this.getVersionStats(fileId)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file_versions_${fileId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clean up old versions (older than 30 days)
  cleanupOldVersions() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    let totalCleaned = 0;
    
    Object.keys(this.versions).forEach(fileId => {
      const initialLength = this.versions[fileId].length;
      this.versions[fileId] = this.versions[fileId].filter(version => {
        return new Date(version.timestamp) >= cutoffDate;
      });
      
      totalCleaned += initialLength - this.versions[fileId].length;
      
      // Delete versions array if empty
      if (this.versions[fileId].length === 0) {
        delete this.versions[fileId];
      }
    });

    if (totalCleaned > 0) {
      this.saveVersions();
      console.log(`Cleaned up ${totalCleaned} old versions`);
    }
    
    return totalCleaned;
  }

  // Get storage usage
  getStorageUsage() {
    const totalSize = Object.values(this.versions).reduce((total, versions) => {
      return total + versions.reduce((sum, version) => sum + version.fileSize, 0);
    }, 0);

    return {
      totalSize,
      totalVersions: Object.values(this.versions).reduce((sum, versions) => sum + versions.length, 0),
      filesWithVersions: Object.keys(this.versions).length,
      formattedSize: this.formatFileSize(totalSize)
    };
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
const versioningService = new VersioningService();

export default versioningService;
