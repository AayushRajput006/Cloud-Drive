import { useState, useEffect } from 'react';
import taggingService from '../services/taggingService';

function TagManagementPanel({ isOpen, onClose, onFileSelect, onTagAction }) {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('tags');
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState('#1976d2');
  const [selectedTagIcon, setSelectedTagIcon] = useState('label');
  const [tagFilter, setTagFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    // Set up tag listeners
    const handleTagUpdate = (data) => {
      if (activeTab === 'tags') {
        loadData();
      }
    };

    taggingService.addListener('tag_created', handleTagUpdate);
    taggingService.addListener('tag_updated', handleTagUpdate);
    taggingService.addListener('tag_deleted', handleTagUpdate);

    return () => {
      taggingService.removeListener('tag_created', handleTagUpdate);
      taggingService.removeListener('tag_updated', handleTagUpdate);
      taggingService.removeListener('tag_deleted', handleTagUpdate);
    };
  }, [activeTab]);

  const loadData = () => {
    setIsLoading(true);
    try {
      setTags(taggingService.getAllTags());
      setCategories(taggingService.categories || []);
    } catch (error) {
      console.error('Error loading tag data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const tag = taggingService.createTag(newTagName, selectedTagColor, selectedTagIcon);
    setTags(taggingService.getAllTags());
    setNewTagName('');
    
    onTagAction?.('tag_created', tag);
  };

  const handleUpdateTag = (tagId, updates) => {
    const updatedTag = taggingService.updateTag(tagId, updates);
    if (updatedTag) {
      setTags(taggingService.getAllTags());
      onTagAction?.('tag_updated', updatedTag);
    }
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag? Files with this tag will remain untagged.')) {
      const success = taggingService.deleteTag(tagId);
      if (success) {
        setTags(taggingService.getAllTags());
        onTagAction?.('tag_deleted', tagId);
      }
    }
  };

  const handleAddTagsToFile = (fileId, tagIds) => {
    taggingService.addTagsToFile(fileId, tagIds);
    onTagAction?.('file_tagged', { fileId, tagIds });
  };

  const handleRemoveTagsFromFile = (fileId, tagIds) => {
    taggingService.removeTagsFromFile(fileId, tagIds);
    onTagAction?.('file_untagged', { fileId, tagIds });
  };

  const handleExportTags = () => {
    taggingService.exportTags();
  };

  const handleImportTags = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      taggingService.importTags(file)
        .then(result => {
          console.log('Import result:', result);
          loadData();
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Import error:', error);
          setIsLoading(false);
        });
    }
  };

  const getFilteredTags = () => {
    if (!tagFilter) return tags;
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(tagFilter.toLowerCase()) ||
      tag.id.toLowerCase().includes(tagFilter.toLowerCase())
    );
  };

  const getTagUsageStats = () => {
    const stats = taggingService.getTagStats();
    return {
      totalTags: stats.totalTags,
      taggedFiles: stats.totalTaggedFiles,
      averageTagsPerFile: stats.averageTagsPerFile,
      mostUsed: stats.mostUsedTag
    };
  };

  const predefinedColors = [
    '#1976d2', '#dc2626', '#dc2626', '#059669', 
    '#0288d1', '#d32f2f', '#7986cb', '#6c757d',
    '#198754', '#e91e63', '#f59e0b', '#fbbf24'
  ];

  const predefinedIcons = [
    'label', 'work', 'person', 'priority_high', 'folder_special',
    'description', 'image', 'videocam', 'music_note',
    'folder_zip', 'code', 'table_chart', 'slideshow', 'more_horiz'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-6xl h-full mx-auto my-4 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">sell</span>
            <div>
              <h2 className="text-h2 text-h2">Tags & Categories</h2>
              <p className="text-body-sm text-on-surface-variant">
                Organize your files with custom tags and categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTags}
              className="p-2 hover:bg-surface-container-low rounded-lg"
              title="Export tags"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
            <label className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer" title="Import tags">
              <span className="material-symbols-outlined">upload</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportTags}
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

        {/* Tabs */}
        <div className="flex border-b border-outline-variant">
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'tags' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tags
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'categories' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'stats' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Tags Tab */}
              {activeTab === 'tags' && (
                <div className="p-4">
                  {/* Create New Tag */}
                  <div className="mb-6 p-4 bg-surface-container-low rounded-lg">
                    <h3 className="text-h3 text-h3 mb-4">Create New Tag</h3>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-body-sm font-medium text-on-surface mb-2">
                          Tag Name
                        </label>
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Enter tag name..."
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateTag();
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div>
                          <label className="block text-body-sm font-medium text-on-surface mb-2">
                            Color
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {predefinedColors.map(color => (
                              <button
                                key={color}
                                onClick={() => setSelectedTagColor(color)}
                                className={`w-8 h-8 rounded-lg border-2 ${
                                  selectedTagColor === color 
                                    ? 'border-primary' 
                                    : 'border-outline-variant hover:border-primary'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-body-sm font-medium text-on-surface mb-2">
                            Icon
                          </label>
                          <div className="grid grid-cols-6 gap-2">
                            {predefinedIcons.map(icon => (
                              <button
                                key={icon}
                                onClick={() => setSelectedTagIcon(icon)}
                                className={`p-2 rounded-lg border-2 ${
                                  selectedTagIcon === icon 
                                    ? 'border-primary bg-primary text-white' 
                                    : 'border-outline-variant hover:border-primary'
                                }`}
                                title={icon}
                              >
                                <span className="material-symbols-outlined text-sm">{icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Tag
                      </button>
                    </div>
                  </div>

                  {/* Tag Filter */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Tags List */}
                  <div className="space-y-3">
                    {getFilteredTags().length === 0 ? (
                      <div className="text-center py-8">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                          sell
                        </span>
                        <h3 className="text-h3 text-h3 mb-2">No tags found</h3>
                        <p className="text-body-md text-on-surface-variant">
                          Create your first tag to get started.
                        </p>
                      </div>
                    ) : (
                      getFilteredTags().map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-lg hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: tag.color }}
                            >
                              <span className="material-symbols-outlined text-white text-sm">{tag.icon}</span>
                            </div>
                            
                            <div>
                              <h4 className="text-body-sm font-medium text-on-surface">
                                {tag.name}
                              </h4>
                              <p className="text-body-xs text-on-surface-variant">
                                Used {tag.usage} time{tag.usage !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateTag(tag.id, { name: tag.name })}
                              className="p-2 hover:bg-surface-container-low rounded-lg"
                              title="Edit tag"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
                              className="p-2 hover:bg-surface-container-low rounded-lg text-error"
                              title="Delete tag"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white border border-outline-variant rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <span className="material-symbols-outlined text-white text-xl">{category.icon}</span>
                          </div>
                          
                          <div>
                            <h4 className="text-body-sm font-medium text-on-surface">
                              {category.name}
                            </h4>
                            <p className="text-body-xs text-on-surface-variant">
                              {category.fileTypes.length} file types
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-body-xs text-on-surface-variant">
                          <p className="font-medium mb-2">File Types:</p>
                          <div className="flex flex-wrap gap-1">
                            {category.fileTypes.map(type => (
                              <span
                                key={type}
                                className="px-2 py-1 bg-surface-container-low rounded text-xs"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'stats' && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-surface-container-low rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {getTagUsageStats().totalTags}
                      </div>
                      <div className="text-body-sm text-on-surface-variant">
                        Total Tags
                      </div>
                    </div>
                    
                    <div className="bg-surface-container-low rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">
                        {getTagUsageStats().taggedFiles}
                      </div>
                      <div className="text-body-sm text-on-surface-variant">
                        Tagged Files
                      </div>
                    </div>
                    
                    <div className="bg-surface-container-low rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-tertiary mb-2">
                        {getTagUsageStats().averageTagsPerFile}
                      </div>
                      <div className="text-body-sm text-on-surface-variant">
                        Avg Tags/File
                      </div>
                    </div>
                    
                    {getTagUsageStats().mostUsed && (
                      <div className="bg-surface-container-low rounded-lg p-6 text-center lg:col-span-3">
                        <div className="text-body-sm text-on-surface-variant mb-2">
                          Most Used Tag
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getTagUsageStats().mostUsed.color }}
                          >
                            <span className="material-symbols-outlined text-white text-sm">
                              {getTagUsageStats().mostUsed.icon}
                            </span>
                          </div>
                          <span className="text-body-sm font-medium text-on-surface">
                            {getTagUsageStats().mostUsed.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TagManagementPanel;
