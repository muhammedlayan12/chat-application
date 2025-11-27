import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with better error handling
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    throw new Error('Cannot connect to backend server. Make sure backend is running on port 5000.');
  }
};

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    console.log('📝 Registering user:', { name, email });
    console.log('🌐 API URL:', API_URL);
    
    const response = await apiClient.post('/auth/register', { name, email, password });
    console.log('✅ Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Better error handling for network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000. Run: cd chat-backend && npm run dev');
    }
    
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Backend might not be running.');
    } else {
      // Something else happened
      throw error;
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('🔐 Logging in user:', email);
    console.log('🌐 API URL:', API_URL);
    
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('✅ Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    // Better error handling for network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000. Run: cd chat-backend && npm run dev');
    }
    
    if (error.response) {
      throw error;
    } else if (error.request) {
      throw new Error('No response from server. Backend might not be running.');
    } else {
      throw error;
    }
  }
};

export const getUsers = async () => {
  const response = await apiClient.get('/auth/users');
  return response.data;
};

export const deleteUser = async (email: string) => {
  const response = await apiClient.delete(`/auth/users/${encodeURIComponent(email)}`);
  return response.data;
};

export const makeAdmin = async (email: string) => {
  const response = await apiClient.post('/auth/users/make-admin', { email });
  return response.data;
};

export const removeAdmin = async (email: string) => {
  const response = await apiClient.post('/auth/users/remove-admin', { email });
  return response.data;
};

export const updateUser = async (email: string, data: { name?: string; isAdmin?: boolean }) => {
  const response = await apiClient.put(`/auth/users/${encodeURIComponent(email)}`, data);
  return response.data;
};

export const getOnlineUsers = async () => {
  const response = await apiClient.get('/online-users');
  return response.data;
};

export const getStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};
