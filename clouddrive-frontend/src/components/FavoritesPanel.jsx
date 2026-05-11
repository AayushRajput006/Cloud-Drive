import { useState, useEffect } from 'react';
import favoritesService from '../services/favoritesService';

function FavoritesPanel({ isOpen, onClose, onFileSelect, onFileAction }) {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('addedDate');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites when panel opens
  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = () => {
    setIsLoading(true);
    try {
      const favs = favoritesService.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort favorites
  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites;

    // Apply search filter
    if (searchQuery) {
      filtered = favoritesService.searchFavorites(searchQuery);
    }

    // Apply sorting
    return favoritesService.sortFavorites(sortBy);
  };

  const handleToggleFavorite = (item) => {
    if (favoritesService.isFavorite(item.id)) {
      favoritesService.removeFavorite(item.id);
    } else {
      favoritesService.addFavorite(item);
    }
    loadFavorites(); // Refresh list
  };

  const handleSelectItem = (item, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const newSelected = new Set(selectedItems);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedItems(newSelected);
    } else {
      // Single select
      setSelectedItems(new Set([item.id]));
      onFileSelect?.(item);
    }
  };

  const handleBulkAction = (action) => {
    const selectedFavs = favorites.filter(fav => selectedItems.has(fav.id));
    onFileAction?.(action, selectedFavs);
    setSelectedItems(new Set()); // Clear selection
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      favoritesService.importFavorites(file)
        .then(result => {
          console.log(`Imported ${result.imported} favorites, total: ${result.total}`);
          loadFavorites();
        })
        .catch(error => {
          console.error('Import failed:', error);
        });
    }
  };

  const handleExport = () => {
    favoritesService.exportFavorites();
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

  if (!isOpen) return null;

  const displayFavorites = getFilteredAndSortedFavorites();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-6xl h-full mx-auto my-4 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">star</span>
            <h2 className="text-h2 text-h2">Favorites</h2>
            <span className="text-body-sm text-on-surface-variant">
              ({favorites.length} items)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-surface-container-low rounded-lg"
              title="Export favorites"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
            <label className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer" title="Import favorites">
              <span className="material-symbols-outlined">upload</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 p-4 border-b border-outline-variant">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="addedDate">Recently Added</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="modified">Modified</option>
          </select>

          <div className="flex items-center bg-surface-container-low rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-on-surface'}`}
            >
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-fixed border-b border-outline-variant">
            <span className="text-body-sm text-primary">
              {selectedItems.size} selected
            </span>
            <button
              onClick={() => handleBulkAction('download')}
              className="px-3 py-1 bg-primary text-white rounded text-body-sm"
            >
              Download
            </button>
            <button
              onClick={() => handleBulkAction('share')}
              className="px-3 py-1 bg-primary text-white rounded text-body-sm"
            >
              Share
            </button>
            <button
              onClick={() => handleBulkAction('remove')}
              className="px-3 py-1 bg-error text-white rounded text-body-sm"
            >
              Remove from Favorites
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : displayFavorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                star_border
              </span>
              <h3 className="text-h3 text-h3 mb-2">No favorites yet</h3>
              <p className="text-body-md text-on-surface-variant">
                {searchQuery 
                  ? 'No favorites match your search'
                  : 'Start adding files and folders to your favorites for quick access'
                }
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayFavorites.map((item) => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-lg border border-outline-variant p-4 hover:border-primary hover:shadow-md transition-all ${
                    selectedItems.has(item.id) ? 'border-primary bg-primary-fixed' : 'bg-white'
                  }`}
                  onClick={(e) => handleSelectItem(item, e)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-sm">
                      star
                    </span>
                  </button>
                  
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">
                      {item.icon}
                    </span>
                    <h4 className="text-body-sm font-medium text-center truncate w-full mb-1">
                      {item.name}
                    </h4>
                    <p className="text-body-xs text-on-surface-variant">
                      {formatFileSize(item.size)}
                    </p>
                    <p className="text-body-xs text-on-surface-variant">
                      Added {formatDate(item.addedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {displayFavorites.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container-low cursor-pointer transition-all ${
                    selectedItems.has(item.id) ? 'border-primary bg-primary-fixed' : 'bg-white'
                  }`}
                  onClick={(e) => handleSelectItem(item, e)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedItems);
                      if (newSelected.has(item.id)) {
                        newSelected.delete(item.id);
                      } else {
                        newSelected.add(item.id);
                      }
                      setSelectedItems(newSelected);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-outline-variant"
                  />
                  
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {item.icon}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-medium truncate">{item.name}</h4>
                    <p className="text-body-xs text-on-surface-variant">
                      {formatFileSize(item.size)} • Added {formatDate(item.addedDate)}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                    className="p-1 hover:bg-surface-container-low rounded"
                  >
                    <span className="material-symbols-outlined text-primary">
                      star
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPanel;
