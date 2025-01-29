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
});

export const login = async (email, password) => {
  console.log('Login request payload:', { email, password });
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const response = await api.post('/auth/login', { 
      email: email.trim(),
      password: password.trim()
    });
    
    console.log('Login response:', response.data);
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

export const register = async (userData) => {
  try {
    console.log('Registration request payload:', {
      ...userData,
      password: '****'
    });
    
    const response = await api.post('/auth/register', userData);
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
    const response = await api.get('/notifications');
    return response;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

export const deleteNotification = (id) => 
  api.delete(`/notifications/${id}`);

export const createPayment = (paymentData) => 
  api.post('/payments', paymentData);

export const getPaymentHistory = () => 
  api.get('/payments/history');

export default api; 