// Input validation utilities
export const validationService = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Password validation
  isValidPassword: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        minLength: password.length >= minLength ? null : 'Password must be at least 8 characters long',
        hasUpperCase: hasUpperCase ? null : 'Password must contain at least one uppercase letter',
        hasLowerCase: hasLowerCase ? null : 'Password must contain at least one lowercase letter',
        hasNumbers: hasNumbers ? null : 'Password must contain at least one number',
        hasSpecialChar: hasSpecialChar ? null : 'Password must contain at least one special character'
      }
    };
  },

  // Username validation
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // File name validation
  isValidFileName: (fileName) => {
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    
    return {
      isValid: !invalidChars.test(fileName) && 
                !reservedNames.test(fileName.split('.')[0]) &&
                fileName.length > 0 &&
                fileName.length <= 255,
      errors: {
        invalidChars: invalidChars.test(fileName) ? 'File name contains invalid characters' : null,
        reservedName: reservedNames.test(fileName.split('.')[0]) ? 'File name is reserved' : null,
        empty: fileName.length === 0 ? 'File name cannot be empty' : null,
        tooLong: fileName.length > 255 ? 'File name is too long (max 255 characters)' : null
      }
    };
  },

  // File size validation
  isValidFileSize: (size, maxSize = 100 * 1024 * 1024) => { // Default 100MB
    return {
      isValid: size > 0 && size <= maxSize,
      errors: {
        empty: size === 0 ? 'File cannot be empty' : null,
        tooLarge: size > maxSize ? `File is too large (max ${formatFileSize(maxSize)})` : null
      }
    };
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '')
      .trim();
  },

  // Validate share permissions
  isValidSharePermissions: (permissions) => {
    const validPermissions = ['can_view', 'can_edit', 'can_comment', 'can_delete', 'can_manage'];
    return validPermissions.includes(permissions);
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default validationService;
