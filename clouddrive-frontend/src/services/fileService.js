import { authService } from './authService';


// const API_BASE_URL = 'https://cloud-drive-1.onrender.com';
const API_BASE_URL = 'http://localhost:8080';

const API_BASE_URL = "https://cloud-drive-1.onrender.com";
// const API_BASE_URL = 'http://localhost:8080';


const fileService = {
  // Upload file
  uploadFile: async (file, folderId = null) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const fileResponse = await response.json();
    return {
      id: String(fileResponse.id),
      name: fileResponse.fileName,
      type: fileResponse.fileType || 'unknown',
      size: fileResponse.size,
      createdAt: fileResponse.uploadDate,
      modifiedAt: fileResponse.uploadDate,
      url: fileResponse.fileUrl
    };
  },

  // List user files
  listFiles: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        return []; // No token yet, return empty array
      }

      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      return data.map(file => ({
        id: String(file.id),
        name: file.fileName,
        type: file.fileType || 'unknown',
        size: file.size,
        createdAt: file.uploadDate,
        modifiedAt: file.uploadDate,
        url: file.fileUrl
      }));
    } catch (error) {
      console.warn('Failed to fetch files:', error);
      return [];
    }
  },

  // Search files
  searchFiles: async (query) => {
    try {
      const token = authService.getToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE_URL}/files/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      return response.json();
    } catch (error) {
      console.warn('Search failed:', error);
      return [];
    }
  },

  // Get file details
  getFileDetails: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file details');
    }

    return response.json();
  },

  // Download file
  downloadFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/download/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file'; // The server will provide the actual filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // Move file to folder
  moveFile: async (fileId, folderId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/${fileId}/folder`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderId })
    });

    if (!response.ok) {
      throw new Error('Move failed');
    }

    return response.json();
  },

  // Delete file
  deleteFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }
  },

  // Share file
  shareFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/share/${fileId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Share failed');
    }

    return response.json();
  },

  // Starred files
  listStarredFiles: async () => {
    const token = authService.getToken();
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/files/starred`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch starred files');
    }

    const data = await response.json();
    return (data || []).map(file => ({
      id: String(file.id),
      name: file.fileName || file.name,
      type: file.fileType || file.type,
      size: file.size,
      createdAt: file.uploadDate || file.createdAt,
      path: file.filePath || file.path,
      fileType: file.fileType || file.type
    }));
  },

  starFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/${fileId}/star`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Star failed');
    }
  },

  unstarFile: async (fileId) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/files/${fileId}/star`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Unstar failed');
    }
  },

  // Recently uploaded files (DB-based)
  recentFiles: async (limit = 20) => {
    try {
      const token = authService.getToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE_URL}/files/recent?limit=${encodeURIComponent(limit)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent files');
      }

      const data = await response.json();
      return (data || []).map(file => ({
        id: String(file.id),
        name: file.fileName,
        type: file.fileType || 'unknown',
        size: file.size,
        createdAt: file.uploadDate,
        modifiedAt: file.uploadDate,
        lastAccessed: file.uploadDate,
        // keep fileUrl if backend starts sending it
        url: file.fileUrl
      }));
    } catch (error) {
      console.warn('Failed to fetch recent files:', error);
      return [];
    }
  },

  // Trash
  listTrashItems: async () => {
    console.log('Fetching trash items...');
    const token = authService.getToken();
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/files/trash`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trash items');
    }

    const data = await response.json();
    return (data || []).map(item => ({
      trashItemId: String(item.trashItemId ?? item.id),
      id: String(item.id ?? item.trashItemId), // keep for compatibility
      name: item.originalName || item.name,
      type: item.type || (item.file?.type) || 'unknown',
      size: item.size || item.file?.size || 0,
      originalPath: item.originalPath,
      deletedAt: item.deletedAt,
      // backend will tell us if it can be restored (not expired)
      canRestore: item.canRestore ?? true,
      fileId: item.fileId ?? item.file?.id ?? null
    }));
  },

  restoreTrashItem: async (trashItemId) => {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/files/trash/${trashItemId}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to restore from trash');
    }
  },

  permanentlyDeleteTrashItem: async (trashItemId) => {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/files/trash/${trashItemId}/permanent-delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to permanently delete from trash');
    }
  },

  emptyTrash: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/files/trash/empty`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to empty trash');
    }
  }
};

export { fileService };
export default fileService;



