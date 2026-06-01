import { authService } from './authService';

const API_BASE_URL = 'https://cloud-drive-1.onrender.com';

const storageService = {
  getStorageUsage: async () => {
    const token = authService.getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/files/storage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch storage usage');
    }

    return response.json();
  },
};

export default storageService;

