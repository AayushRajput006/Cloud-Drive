// File Tagging Service - Manage file tags and categorization
class TaggingService {
  constructor() {
    this.TAGS_KEY = 'clouddrive_tags';
    this.FILE_TAGS_KEY = 'clouddrive_file_tags';
    this.CATEGORIES_KEY = 'clouddrive_categories';
    
    this.tags = this.loadTags();
    this.fileTags = this.loadFileTags();
    this.categories = this.loadCategories();
    this.listeners = new Set();
  }

  // Load tags from localStorage
  loadTags() {
    try {
      const stored = localStorage.getItem(this.TAGS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultTags();
    } catch (error) {
      console.error('Error loading tags:', error);
      return this.getDefaultTags();
    }
  }

  // Load file tags from localStorage
  loadFileTags() {
    try {
      const stored = localStorage.getItem(this.FILE_TAGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading file tags:', error);
      return {};
    }
  }

  // Load categories from localStorage
  loadCategories() {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      return this.getDefaultCategories();
    }
  }

  // Get default tags
  getDefaultTags() {
    return [
      { id: 'work', name: 'Work', color: '#1976d2', icon: 'work', usage: 0 },
      { id: 'personal', name: 'Personal', color: '#dc2626', icon: 'person', usage: 0 },
      { id: 'important', name: 'Important', color: '#dc2626', icon: 'priority_high', usage: 0 },
      { id: 'projects', name: 'Projects', color: '#059669', icon: 'folder_special', usage: 0 },
      { id: 'documents', name: 'Documents', color: '#1976d2', icon: 'description', usage: 0 },
      { id: 'images', name: 'Images', color: '#0288d1', icon: 'image', usage: 0 },
      { id: 'videos', name: 'Videos', color: '#d32f2f', icon: 'videocam', usage: 0 },
      { id: 'music', name: 'Music', color: '#7986cb', icon: 'music_note', usage: 0 },
      { id: 'archives', name: 'Archives', color: '#6c757d', icon: 'folder_zip', usage: 0 }
    ];
  }

  // Get default categories
  getDefaultCategories() {
    return [
      { id: 'documents', name: 'Documents', color: '#1976d2', icon: 'description', fileTypes: ['pdf', 'doc', 'docx', 'txt', 'rtf'] },
      { id: 'images', name: 'Images', color: '#0288d1', icon: 'image', fileTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'] },
      { id: 'videos', name: 'Videos', color: '#d32f2f', icon: 'videocam', fileTypes: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'] },
      { id: 'audio', name: 'Audio', color: '#7986cb', icon: 'music_note', fileTypes: ['mp3', 'wav', 'flac', 'aac', 'ogg'] },
      { id: 'archives', name: 'Archives', color: '#6c757d', icon: 'folder_zip', fileTypes: ['zip', 'rar', '7z', 'tar', 'gz'] },
      { id: 'code', name: 'Code', color: '#059669', icon: 'code', fileTypes: ['js', 'html', 'css', 'py', 'java', 'cpp', 'c', 'jsx'] },
      { id: 'spreadsheets', name: 'Spreadsheets', color: '#198754', icon: 'table_chart', fileTypes: ['xls', 'xlsx', 'csv'] },
      { id: 'presentations', name: 'Presentations', color: '#e91e63', icon: 'slideshow', fileTypes: ['ppt', 'pptx'] },
      { id: 'other', name: 'Other', color: '#6c757d', icon: 'more_horiz', fileTypes: [] }
    ];
  }

  // Save tags to localStorage
  saveTags() {
    try {
      localStorage.setItem(this.TAGS_KEY, JSON.stringify(this.tags));
      return true;
    } catch (error) {
      console.error('Error saving tags:', error);
      return false;
    }
  }

  // Save file tags to localStorage
  saveFileTags() {
    try {
      localStorage.setItem(this.FILE_TAGS_KEY, JSON.stringify(this.fileTags));
      return true;
    } catch (error) {
      console.error('Error saving file tags:', error);
      return false;
    }
  }

  // Save categories to localStorage
  saveCategories() {
    try {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(this.categories));
      return true;
    } catch (error) {
      console.error('Error saving categories:', error);
      return false;
    }
  }

  // Create new tag
  createTag(name, color = '#1976d2', icon = 'label') {
    const tag = {
      id: Date.now() + Math.random(),
      name: name.trim(),
      color,
      icon,
      usage: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user' // TODO: Get from auth context
    };

    this.tags.push(tag);
    this.saveTags();
    this.notifyListeners('tag_created', tag);
    
    return tag;
  }

  // Update existing tag
  updateTag(tagId, updates) {
    const tagIndex = this.tags.findIndex(tag => tag.id === tagId);
    if (tagIndex !== -1) {
      this.tags[tagIndex] = { ...this.tags[tagIndex], ...updates, updatedAt: new Date().toISOString() };
      this.saveTags();
      this.notifyListeners('tag_updated', this.tags[tagIndex]);
      return this.tags[tagIndex];
    }
    return null;
  }

  // Delete tag
  deleteTag(tagId) {
    const initialLength = this.tags.length;
    this.tags = this.tags.filter(tag => tag.id !== tagId);
    
    if (this.tags.length < initialLength) {
      // Remove tag from all files that have it
      Object.keys(this.fileTags).forEach(fileId => {
        this.fileTags[fileId] = this.fileTags[fileId].filter(tagId => tagId !== tagId);
      });
      
      this.saveTags();
      this.saveFileTags();
      this.notifyListeners('tag_deleted', tagId);
      return true;
    }
    
    return false;
  }

  // Add tags to file
  addTagsToFile(fileId, tagIds) {
    if (!this.fileTags[fileId]) {
      this.fileTags[fileId] = [];
    }
    
    // Add new tags (avoid duplicates)
    tagIds.forEach(tagId => {
      if (!this.fileTags[fileId].includes(tagId)) {
        this.fileTags[fileId].push(tagId);
        
        // Update tag usage
        const tag = this.tags.find(t => t.id === tagId);
        if (tag) {
          tag.usage = (tag.usage || 0) + 1;
        }
      }
    });

    this.saveFileTags();
    this.notifyListeners('file_tagged', { fileId, tagIds });
    
    return this.fileTags[fileId];
  }

  // Remove tags from file
  removeTagsFromFile(fileId, tagIds) {
    if (!this.fileTags[fileId]) return false;
    
    const initialLength = this.fileTags[fileId].length;
    this.fileTags[fileId] = this.fileTags[fileId].filter(id => !tagIds.includes(id));
    
    if (this.fileTags[fileId].length < initialLength) {
      // Update tag usage
      tagIds.forEach(removedTagId => {
        const tag = this.tags.find(t => t.id === removedTagId);
        if (tag && tag.usage > 0) {
          tag.usage = tag.usage - 1;
        }
      });
      
      this.saveTags();
      this.saveFileTags();
      this.notifyListeners('file_untagged', { fileId, tagIds });
      
      return true;
    }
    
    return false;
  }

  // Get tags for file
  getFileTags(fileId) {
    return this.fileTags[fileId] || [];
  }

  // Get files with specific tag
  getFilesWithTag(tagId) {
    const filesWithTag = [];
    
    Object.keys(this.fileTags).forEach(fileId => {
      if (this.fileTags[fileId].includes(tagId)) {
        filesWithTag.push(fileId);
      }
    });
    
    return filesWithTag;
  }

  // Get all tags
  getAllTags() {
    return [...this.tags].sort((a, b) => b.usage - a.usage);
  }

  // Get tags by usage
  getPopularTags(limit = 10) {
    return [...this.tags]
      .sort((a, b) => b.usage - a.usage)
      .slice(0, limit);
  }

  // Search tags
  searchTags(query) {
    const lowerQuery = query.toLowerCase();
    return this.tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery) ||
      tag.id.toLowerCase().includes(lowerQuery)
    );
  }

  // Get tag by ID
  getTagById(tagId) {
    return this.tags.find(tag => tag.id === tagId);
  }

  // Get category for file type
  getCategoryForFileType(fileType) {
    const extension = fileType?.toLowerCase().split('.').pop() || '';
    
    for (const category of this.categories) {
      if (category.fileTypes.includes(extension)) {
        return category;
      }
    }
    
    return this.categories.find(cat => cat.id === 'other');
  }

  // Auto-categorize file
  autoCategorizeFile(file) {
    const category = this.getCategoryForFileType(file.name);
    const autoTags = [category.id];
    
    // Add auto-generated tags based on file properties
    if (file.size > 10 * 1024 * 1024) { // > 10MB
      autoTags.push('large');
    }
    
    if (file.name.toLowerCase().includes('draft')) {
      autoTags.push('draft');
    }
    
    if (file.name.toLowerCase().includes('final')) {
      autoTags.push('final');
    }
    
    return { category, autoTags };
  }

  // Get tag suggestions for file
  getTagSuggestions(file) {
    const suggestions = [];
    const fileCategory = this.getCategoryForFileType(file.name);
    
    // Add category tag
    suggestions.push({
      id: fileCategory.id,
      name: fileCategory.name,
      color: fileCategory.color,
      icon: fileCategory.icon,
      type: 'category'
    });
    
    // Add popular tags
    const popularTags = this.getPopularTags(5);
    suggestions.push(...popularTags.map(tag => ({
      ...tag,
      type: 'popular'
    })));
    
    // Add recently used tags
    const recentFiles = Object.keys(this.fileTags).slice(-10);
    const recentTagIds = new Set();
    recentFiles.forEach(fileId => {
      this.fileTags[fileId]?.forEach(tagId => recentTagIds.add(tagId));
    });
    
    recentTagIds.forEach(tagId => {
      const tag = this.getTagById(tagId);
      if (tag && !suggestions.find(s => s.id === tagId)) {
        suggestions.push({
          ...tag,
          type: 'recent'
        });
      }
    });
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  // Get tag statistics
  getTagStats() {
    const stats = {
      totalTags: this.tags.length,
      totalTaggedFiles: Object.keys(this.fileTags).length,
      averageTagsPerFile: 0,
      mostUsedTag: null,
      categoryDistribution: {}
    };
    
    // Calculate average tags per file
    if (stats.totalTaggedFiles > 0) {
      const totalTagsUsed = Object.values(this.fileTags).reduce((sum, tags) => sum + tags.length, 0);
      stats.averageTagsPerFile = (totalTagsUsed / stats.totalTaggedFiles).toFixed(2);
    }
    
    // Find most used tag
    const tagUsage = {};
    Object.values(this.fileTags).forEach(tags => {
      tags.forEach(tagId => {
        tagUsage[tagId] = (tagUsage[tagId] || 0) + 1;
      });
    });
    
    let maxUsage = 0;
    Object.entries(tagUsage).forEach(([tagId, usage]) => {
      if (usage > maxUsage) {
        maxUsage = usage;
        stats.mostUsedTag = this.getTagById(tagId);
      }
    });
    
    // Calculate category distribution
    this.categories.forEach(category => {
      stats.categoryDistribution[category.id] = 0;
    });
    
    Object.keys(this.fileTags).forEach(fileId => {
      // This would need file metadata to determine category
      // For now, we'll use a simple heuristic based on file count
      stats.categoryDistribution['other'] = (stats.categoryDistribution['other'] || 0) + 1;
    });
    
    return stats;
  }

  // Export tags
  exportTags() {
    const exportData = {
      exportDate: new Date().toISOString(),
      tags: this.tags,
      fileTags: this.fileTags,
      categories: this.categories,
      stats: this.getTagStats()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tags_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import tags
  importTags(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.tags && Array.isArray(importData.tags)) {
            // Merge with existing tags (avoid duplicates)
            const existingTagIds = new Set(this.tags.map(t => t.id));
            const newTags = importData.tags.filter(tag => !existingTagIds.has(tag.id));
            
            this.tags = [...this.tags, ...newTags];
            this.saveTags();
          }
          
          if (importData.fileTags && typeof importData.fileTags === 'object') {
            // Merge file tags
            this.fileTags = { ...this.fileTags, ...importData.fileTags };
            this.saveFileTags();
          }
          
          if (importData.categories && Array.isArray(importData.categories)) {
            // Replace categories
            this.categories = importData.categories;
            this.saveCategories();
          }
          
          resolve({
            tagsImported: newTags.length,
            fileTagsImported: Object.keys(importData.fileTags || {}).length,
            categoriesImported: importData.categories?.length || 0
          });
        } catch (error) {
          reject(new Error('Error parsing tags file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading tags file'));
      reader.readAsText(file);
    });
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

  // Cleanup unused tags
  cleanupUnusedTags() {
    const usedTagIds = new Set();
    Object.values(this.fileTags).forEach(tags => {
      tags.forEach(tagId => usedTagIds.add(tagId));
    });
    
    const initialLength = this.tags.length;
    this.tags = this.tags.filter(tag => usedTagIds.has(tag.id));
    
    if (this.tags.length < initialLength) {
      this.saveTags();
      console.log(`Cleaned up ${initialLength - this.tags.length} unused tags`);
    }
    
    return initialLength - this.tags.length;
  }
}

// Create singleton instance
const taggingService = new TaggingService();

export default taggingService;
