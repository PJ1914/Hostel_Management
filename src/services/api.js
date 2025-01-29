import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use((response) => {
  console.log('API Response:', response);
  return response;
}, (error) => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    data: error.response?.data
  });
  return Promise.reject(error);
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { 
      email: email.trim(),
      password: password.trim()
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Registration request payload:', {
      ...userData,
      password: '****'
    });
    
    const response = await api.post('/api/auth/register', userData);
    console.log('Registration response:', response.data);
    return response;
  } catch (error) {
    console.error('API Error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get('/api/notifications');
    return response;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.patch(`/api/notifications/${id}/read`);
    return response;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

export const deleteNotification = (id) => 
  api.delete(`/api/notifications/${id}`);

export const createPayment = (paymentData) => 
  api.post('/api/payments', paymentData);

export const getPaymentHistory = () => 
  api.get('/api/payments/history');

export default api; 