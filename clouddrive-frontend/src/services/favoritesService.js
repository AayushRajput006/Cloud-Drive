// Favorites Service - Manage file and folder favorites
class FavoritesService {
  constructor() {
    this.FAVORITES_KEY = 'clouddrive_favorites';
    this.favorites = this.loadFavorites();
  }

  // Load favorites from localStorage
  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  // Save favorites to localStorage
  saveFavorites() {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this.favorites));
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  }

  // Add file/folder to favorites
  addFavorite(item) {
    const favoriteItem = {
      id: item.id,
      name: item.name,
      type: item.type || 'file',
      size: item.size || 0,
      modified: item.modified || new Date().toISOString(),
      path: item.path || '/',
      icon: item.icon || 'file_present',
      addedDate: new Date().toISOString()
    };

    // Check if already exists
    const existingIndex = this.favorites.findIndex(fav => fav.id === item.id);
    if (existingIndex === -1) {
      this.favorites.unshift(favoriteItem); // Add to beginning
      this.saveFavorites();
      return true;
    }
    return false;
  }

  // Remove from favorites
  removeFavorite(itemId) {
    const initialLength = this.favorites.length;
    this.favorites = this.favorites.filter(fav => fav.id !== itemId);
    
    if (this.favorites.length < initialLength) {
      this.saveFavorites();
      return true;
    }
    return false;
  }

  // Check if item is favorite
  isFavorite(itemId) {
    return this.favorites.some(fav => fav.id === itemId);
  }

  // Get all favorites
  getFavorites() {
    return [...this.favorites];
  }

  // Get favorites by type
  getFavoritesByType(type) {
    return this.favorites.filter(fav => fav.type === type);
  }

  // Search favorites
  searchFavorites(query) {
    const lowerQuery = query.toLowerCase();
    return this.favorites.filter(fav => 
      fav.name.toLowerCase().includes(lowerQuery) ||
      fav.path.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort favorites
  sortFavorites(sortBy = 'addedDate') {
    const sorted = [...this.favorites];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        sorted.sort((a, b) => b.size - a.size);
        break;
      case 'modified':
        sorted.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        break;
      case 'addedDate':
      default:
        sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
    }
    
    this.favorites = sorted;
    this.saveFavorites();
    return sorted;
  }

  // Clear all favorites
  clearFavorites() {
    this.favorites = [];
    return this.saveFavorites();
  }

  // Get favorites count
  getFavoritesCount() {
    return this.favorites.length;
  }

  // Get recently added favorites (last 7 days)
  getRecentFavorites(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.favorites.filter(fav => 
      new Date(fav.addedDate) >= cutoffDate
    );
  }

  // Export favorites
  exportFavorites() {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      favorites: this.favorites
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favorites_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import favorites
  importFavorites(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.favorites && Array.isArray(importData.favorites)) {
            // Merge with existing favorites, avoiding duplicates
            const existingIds = new Set(this.favorites.map(fav => fav.id));
            const newFavorites = importData.favorites.filter(fav => !existingIds.has(fav.id));
            
            this.favorites = [...newFavorites, ...this.favorites];
            this.saveFavorites();
            resolve({
              imported: newFavorites.length,
              total: this.favorites.length
            });
          } else {
            reject(new Error('Invalid favorites file format'));
          }
        } catch (error) {
          reject(new Error('Error parsing favorites file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}

// Create singleton instance
const favoritesService = new FavoritesService();

export default favoritesService;
