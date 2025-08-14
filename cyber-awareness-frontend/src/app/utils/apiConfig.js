// API Configuration and Authentication Utilities

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5050/api';

// Get JWT token from localStorage
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

// Set JWT token in localStorage
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

// Remove JWT token from localStorage
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
};

// Get default headers for API requests
export const getDefaultHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getDefaultHeaders();
  
  const config = {
    headers,
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API helper functions for common operations
export const apiHelpers = {
  // GET request
  get: (endpoint) => apiRequest(endpoint),
  
  // POST request
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // PUT request
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  })
};

// Error handling utilities
export const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  // Return fallback data if provided
  if (fallbackData !== null) {
    return fallbackData;
  }
  
  // Re-throw error if no fallback
  throw error;
};

// Loading state management
export const createLoadingState = () => {
  return {
    loading: true,
    error: null,
    data: null
  };
};

// Success state management
export const createSuccessState = (data) => {
  return {
    loading: false,
    error: null,
    data
  };
};

// Error state management
export const createErrorState = (error) => {
  return {
    loading: false,
    error,
    data: null
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Get user role from JWT token (if available)
export const getUserRole = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Decode JWT token (basic implementation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Get user ID from JWT token (if available)
export const getUserId = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.user_id;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}; 