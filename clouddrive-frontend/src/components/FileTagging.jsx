import { useState, useEffect } from 'react';
import taggingService from '../services/taggingService';

function FileTagging({ isOpen, onClose, file, onTagUpdate }) {
  const [tags, setTags] = useState([]);
  const [fileTags, setFileTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, file]);

  const loadData = () => {
    try {
      const allTags = taggingService.getAllTags();
      const currentFileTags = taggingService.getFileTags(file?.id) || [];
      const tagSuggestions = taggingService.getTagSuggestions(file);
      
      setTags(allTags);
      setFileTags(currentFileTags);
      setSelectedTags(currentFileTags);
      setSuggestions(tagSuggestions);
    } catch (error) {
      console.error('Error loading tag data:', error);
    }
  };

  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      // Remove tag
      const newSelectedTags = selectedTags.filter(id => id !== tagId);
      setSelectedTags(newSelectedTags);
      
      // Remove from file
      taggingService.removeTagsFromFile(file.id, [tagId]);
    } else {
      // Add tag
      const newSelectedTags = [...selectedTags, tagId];
      setSelectedTags(newSelectedTags);
      
      // Add to file
      taggingService.addTagsToFile(file.id, [tagId]);
    }
  };

  const handleCreateAndAddTag = () => {
    if (!newTagInput.trim()) return;

    const newTag = taggingService.createTag(newTagInput);
    setTags(taggingService.getAllTags());
    setSuggestions(taggingService.getTagSuggestions(file));
    
    // Add the new tag to file
    handleTagSelect(newTag.id);
    setNewTagInput('');
    setShowSuggestions(false);
  };

  const handleInputChange = (value) => {
    setNewTagInput(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') {
      // Add category tag
      const categoryTag = {
        id: suggestion.id,
        name: suggestion.name,
        color: suggestion.color,
        icon: suggestion.icon
      };
      
      // Create category tag if it doesn't exist
      const existingTag = tags.find(t => t.id === suggestion.id);
      if (!existingTag) {
        const newTag = taggingService.createTag(suggestion.name, suggestion.color, suggestion.icon);
        setTags(taggingService.getAllTags());
      }
      
      handleTagSelect(suggestion.id);
    } else {
      handleTagSelect(suggestion.id);
    }
    
    setNewTagInput('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagId) => {
    handleTagSelect(tagId);
  };

  const handleApplyTags = () => {
    onTagUpdate?.(file.id, selectedTags);
    onClose();
  };

  const getSelectedTagDetails = (tagId) => {
    return tags.find(tag => tag.id === tagId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-2xl h-full mx-auto my-4 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">sell</span>
            <div>
              <h2 className="text-h2 text-h2">Tag File</h2>
              <p className="text-body-sm text-on-surface-variant">
                {file.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {formatFileSize(file.size)} • {file.type || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyTags}
              disabled={selectedTags.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Tags
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            {/* Current Tags */}
            <div>
              <h3 className="text-h3 text-h3 mb-3">Current Tags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.length === 0 ? (
                  <div className="text-body-sm text-on-surface-italic">
                    No tags applied
                  </div>
                ) : (
                  selectedTags.map(tagId => {
                    const tag = getSelectedTagDetails(tagId);
                    return (
                      <div
                        key={tagId}
                        className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-full border border-outline-variant"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tag.color }}
                        >
                          <span className="material-symbols-outlined text-white text-sm">
                            {tag.icon}
                          </span>
                        </div>
                        <span className="text-body-sm text-on-surface font-medium">
                          {tag.name}
                        </span>
                        <button
                          onClick={() => handleRemoveTag(tagId)}
                          className="ml-2 p-1 hover:bg-surface-container rounded-full"
                          title="Remove tag"
                        >
                          <span className="material-symbols-outlined text-xs text-error">close</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Add New Tag */}
            <div>
              <h3 className="text-h3 text-h3 mb-3">Add New Tag</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Type to search or create tag..."
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
                    onFocus={() => setShowSuggestions(true)}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant rounded-lg shadow-xl z-10 max-h-48 overflow-auto">
                      <div className="p-2">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-surface-container-low cursor-pointer rounded"
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: suggestion.color }}
                            >
                              <span className="material-symbols-outlined text-white text-sm">
                                {suggestion.icon}
                              </span>
                            </div>
                            <div>
                              <div className="text-body-sm text-on-surface font-medium">
                                {suggestion.name}
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                {suggestion.type === 'category' ? 'Category' : 'Popular'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleCreateAndAddTag}
                  disabled={!newTagInput.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="text-h3 text-h3 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags
                  .filter(tag => tag.usage > 0)
                  .slice(0, 10)
                  .map(tag => (
                    <div
                      key={tag.id}
                      onClick={() => handleTagSelect(tag.id)}
                      className={`flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-full border border-outline-variant cursor-pointer hover:border-primary transition-colors ${
                        selectedTags.includes(tag.id) ? 'ring-2 ring-primary bg-primary-fixed' : ''
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tag.color }}
                      >
                        <span className="material-symbols-outlined text-white text-sm">
                          {tag.icon}
                        </span>
                      </div>
                      <span className="text-body-sm text-on-surface font-medium">
                        {tag.name}
                      </span>
                      <span className="text-xs text-on-surface-variant ml-2">
                        {tag.usage} uses
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Auto-categorization */}
            <div>
              <h3 className="text-h3 text-h3 mb-3">Suggested Category</h3>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
                  <div>
                    <p className="text-body-sm text-on-surface">
                      Based on file type and content, we suggest:
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-secondary text-white text-xs rounded-full">
                          {taggingService.getCategoryForFileType(file.name)?.name || 'Other'}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          category
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileTagging;
