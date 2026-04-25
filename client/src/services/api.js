import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const animalsAPI = {
  getAll: () => API.get('/animals'),
  create: (data) => API.post('/animals', data),
  update: (id, data) => API.put(`/animals/${id}`, data),
  remove: (id) => API.delete(`/animals/${id}`),
};

export const productsAPI = {
  getAll: () => API.get('/products'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  remove: (id) => API.delete(`/products/${id}`),
};

export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/user'),
  getAll: () => API.get('/orders/all'),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export const commentsAPI = {
  getAll: () => API.get('/comments'),
  create: (data) => API.post('/comments', data),
  remove: (id) => API.delete(`/comments/${id}`),
};

export const promosAPI = {
  getAll: () => API.get('/promos'),
  create: (data) => API.post('/promos', data),
  remove: (id) => API.delete(`/promos/${id}`),
};

export const statsAPI = {
  get: () => API.get('/stats'),
  update: (data) => API.put('/stats', data),
};

export const chatAPI = {
  getHistory: (userId) => API.get(`/chat/history/${userId}`),
};

export default API;
