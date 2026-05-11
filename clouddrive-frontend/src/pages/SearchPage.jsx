import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DriveSidebar from '../components/DriveSidebar';
import DriveTopbar from '../components/DriveTopbar';
import { authService } from '../services/authService';

// Mock search data - replace with actual API calls
const mockSearchResults = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: 245760,
    path: "/Documents/Work/",
    createdAt: "2026-05-10T10:30:00Z",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    owner: "John Doe"
  },
  {
    id: 2,
    name: "Design Mockup.png",
    type: "image",
    size: 1024000,
    path: "/Projects/Marketing/",
    createdAt: "2026-05-09T15:20:00Z",
    fileType: "image/png",
    owner: "John Doe"
  },
  {
    id: 3,
    name: "Budget Spreadsheet.xlsx",
    type: "document",
    size: 512000,
    path: "/Documents/Finance/",
    createdAt: "2026-05-08T09:15:00Z",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    owner: "Jane Smith"
  }
];

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    fileType: 'all',
    dateRange: 'all',
    owner: 'all'
  });
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load search results when query changes
    if (searchQuery.trim()) {
      performSearch();
    }
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/files/search?query=${encodeURIComponent(searchQuery)}&filters=${JSON.stringify(filters)}`, {
      //   headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      // });
      // const results = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on search query
      const filtered = mockSearchResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    performSearch();
  }, [searchQuery, filters]);

  const handleFileAction = useCallback((action, file) => {
    switch (action) {
      case 'open':
        console.log('Opening file:', file);
        break;
      case 'download':
        console.log('Downloading file:', file);
        break;
      case 'share':
        console.log('Sharing file:', file);
        break;
      case 'delete':
        console.log('Deleting file:', file);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  const getFileIcon = (type) => {
    const iconMap = {
      image: 'image',
      video: 'videocam',
      audio: 'headphones',
      pdf: 'picture_as_pdf',
      document: 'description',
      text: 'text_snippet',
      archive: 'folder_zip'
    };
    return iconMap[type] || 'insert_drive_file';
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

  return (
    <AppShell sidebar={<DriveSidebar active="Recent" />} topbar={<DriveTopbar title="Search" />}>
      <div className="p-lg">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-lg">Search</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-lg">
              <div className="flex flex-col lg:flex-row gap-md">
                {/* Search Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for files, folders, and more..."
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md text-on-surface focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-sm">
                  {/* File Type Filter */}
                  <select
                    value={filters.fileType}
                    onChange={(e) => handleFilterChange('fileType', e.target.value)}
                    className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
                  >
                    <option value="all">All Types</option>
                    <option value="document">Documents</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>

                  {/* Date Range Filter */}
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>

                  {/* Owner Filter */}
                  <select
                    value={filters.owner}
                    onChange={(e) => handleFilterChange('owner', e.target.value)}
                    className="px-sm py-xs bg-surface border border-outline-variant rounded-lg text-body-sm text-on-surface"
                  >
                    <option value="all">All Owners</option>
                    <option value="me">My Files</option>
                    <option value="shared">Shared with Me</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {/* Active Filters */}
            {(filters.fileType !== 'all' || filters.dateRange !== 'all' || filters.owner !== 'all') && (
              <div className="flex gap-sm mb-md">
                <span className="text-label-sm text-on-surface-variant">Active filters:</span>
                {filters.fileType !== 'all' && (
                  <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-label-sm">
                    {filters.fileType}
                  </span>
                )}
                {filters.dateRange !== 'all' && (
                  <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-label-sm">
                    {filters.dateRange}
                  </span>
                )}
                {filters.owner !== 'all' && (
                  <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-label-sm">
                    {filters.owner}
                  </span>
                )}
                <button
                  onClick={() => setFilters({ fileType: 'all', dateRange: 'all', owner: 'all' })}
                  className="text-label-sm text-primary hover:text-primary-hover"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="text-center py-xl">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-3xl text-primary">search</span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-sm">Searching...</h2>
              <p className="text-body-md text-on-surface-variant">
                Searching for "{searchQuery}" across your files and folders
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-xl">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-3xl text-primary">search_off</span>
              </div>
              <h2 className="font-h2 text-h2 text-on-surface mb-sm">No results found</h2>
              <p className="text-body-md text-on-surface-variant">
                No files or folders match your search for "{searchQuery}"
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Go to My Files
              </button>
            </div>
          ) : (
            <div>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-md">
                <h2 className="font-h2 text-h2 text-on-surface">
                  Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                </h2>
                <span className="text-label-sm text-on-surface-variant">
                  for "{searchQuery}"
                </span>
              </div>

              {/* Results List/Grid */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-md">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="group relative bg-white border border-outline-variant rounded-lg p-sm hover:border-primary hover:shadow-md transition-all cursor-pointer"
                      onDoubleClick={() => handleFileAction('open', result)}
                    >
                      {/* File Icon */}
                      <div className="flex justify-center mb-sm">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          result.type === 'image' ? 'bg-primary-container-low' : 'bg-surface-container-low'
                        }`}>
                          <span className="material-symbols-outlined text-2xl text-primary">
                            {getFileIcon(result.type)}
                          </span>
                        </div>
                      </div>

                      {/* File Name */}
                      <h3 className="text-body-sm text-on-surface font-medium truncate text-center mb-sm">
                        {result.name}
                      </h3>

                      {/* File Path */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        {result.path}
                      </p>

                      {/* File Size */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        {formatFileSize(result.size)}
                      </p>

                      {/* Owner */}
                      <p className="text-label-xs text-on-surface-variant text-center mb-sm">
                        Owner: {result.owner}
                      </p>

                      {/* Modified Date */}
                      <p className="text-label-xs text-on-surface-variant text-center">
                        Modified: {formatDate(result.createdAt)}
                      </p>

                      {/* Hover Actions */}
                      <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('download', result);
                          }}
                          className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('share', result);
                          }}
                          className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                        >
                          <span className="material-symbols-outlined text-sm">share</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('delete', result);
                          }}
                          className="w-8 h-8 bg-white border border-outline-variant rounded flex items-center justify-center hover:bg-surface-container-low"
                        >
                          <span className="material-symbols-outlined text-sm text-error">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">
                          <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined">search</span>
                            Name
                          </div>
                        </th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Size</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Type</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Owner</th>
                        <th className="px-md py-sm text-left text-label-sm text-on-surface font-medium">Modified</th>
                        <th className="px-md py-sm text-right text-label-sm text-on-surface font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((result) => (
                        <tr
                          key={result.id}
                          className="border-b border-outline-variant hover:bg-surface-container-low cursor-pointer"
                          onDoubleClick={() => handleFileAction('open', result)}
                        >
                          <td className="px-md py-sm">
                            <div className="flex items-center gap-sm">
                              <span className="material-symbols-outlined text-primary">
                                {getFileIcon(result.type)}
                              </span>
                              <span className="text-body-sm text-on-surface font-medium">
                                {result.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {formatFileSize(result.size)}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {result.type}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {result.owner}
                          </td>
                          <td className="px-md py-sm text-label-sm text-on-surface-variant">
                            {formatDate(result.createdAt)}
                          </td>
                          <td className="px-md py-sm text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileAction('download', result);
                                }}
                                className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                              >
                                <span className="material-symbols-outlined text-sm">download</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileAction('share', result);
                                }}
                                className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                              >
                                <span className="material-symbols-outlined text-sm">share</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileAction('delete', result);
                                }}
                                className="w-8 h-8 bg-transparent border-0 flex items-center justify-center hover:bg-surface-container-low rounded"
                              >
                                <span className="material-symbols-outlined text-sm text-error">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default SearchPage;
