// Performance utilities for My Files page

export const performanceUtils = {
  // Debounce function to limit API calls
  debounce: (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },

  // Throttle function to limit UI updates
  throttle: (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  },

  // Virtual scrolling for large file lists
  getVisibleItems: (items, containerHeight, itemHeight, scrollTop) => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    
    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalItems: items.length
    };
  },

  // Memory cleanup for large operations
  cleanup: () => {
    // Clear any pending timeouts
    if (typeof window !== 'undefined') {
      // Clear any large objects that might be holding memory
      if (window.gc) {
        window.gc();
      }
    }
  },

  // Performance monitoring
  measure: (name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  },

  // Optimize file list rendering
  shouldUseVirtualScroll: (itemCount) => {
    return itemCount > 100; // Use virtual scrolling for more than 100 items
  },

  // Cache management
  cache: {
    get: (key) => {
      try {
        const cached = localStorage.getItem(`clouddrive_cache_${key}`);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    },
    set: (key, data, ttl = 300000) => { // 5 minutes default TTL
      try {
        const item = {
          data,
          timestamp: Date.now(),
          ttl
        };
        localStorage.setItem(`clouddrive_cache_${key}`, JSON.stringify(item));
      } catch {
        console.warn('Failed to cache item:', key);
      }
    },
    clear: (pattern) => {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('clouddrive_cache_') && (!pattern || key.includes(pattern))) {
            localStorage.removeItem(key);
          }
        });
      } catch {
        console.warn('Failed to clear cache');
      }
    },
    isValid: (key) => {
      try {
        const cached = localStorage.getItem(`clouddrive_cache_${key}`);
        if (!cached) return false;
        
        const item = JSON.parse(cached);
        const now = Date.now();
        
        return (now - item.timestamp) < item.ttl;
      } catch {
        return false;
      }
    }
  },

  // File size optimization
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Lazy loading for images
  loadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  },

  // Batch operations
  batch: {
    process: async (items, batchSize = 10, processFn) => {
      const results = [];
      
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(item => processFn(item))
        );
        results.push(...batchResults);
        
        // Allow UI to update between batches
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      return results;
    }
  }
};
