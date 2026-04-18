import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ft_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ──────────────────────────────────────
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);
export const getMe    = ()     => API.get('/auth/me');

// ─── ANIMALS ───────────────────────────────────
export const getAnimals       = (params) => API.get('/animals', { params });
export const getAnimal        = (id)     => API.get(`/animals/${id}`);
export const createAnimal     = (data)   => API.post('/animals', data);
export const updateAnimal     = (id, d)  => API.put(`/animals/${id}`, d);
export const deleteAnimal     = (id)     => API.delete(`/animals/${id}`);
export const getAnimalLogs    = (id)     => API.get(`/animals/${id}/logs`);
export const addAnimalLog     = (id, d)  => API.post(`/animals/${id}/logs`, d);

// ─── PRODUCTS ──────────────────────────────────
export const getProducts   = ()      => API.get('/products');
export const getProduct    = (id)    => API.get(`/products/${id}`);
export const createProduct = (data)  => API.post('/products', data);
export const updateProduct = (id, d) => API.put(`/products/${id}`, d);
export const deleteProduct = (id)    => API.delete(`/products/${id}`);

// ─── PROMOTIONS ────────────────────────────────
export const getPromotions   = ()     => API.get('/promotions');
export const createPromotion = (data) => API.post('/promotions', data);
export const deletePromotion = (id)   => API.delete(`/promotions/${id}`);

// ─── ORDERS ────────────────────────────────────
export const getOrders     = ()           => API.get('/orders');
export const createOrder   = (data)       => API.post('/orders', data);
export const updateOrderStatus = (id, s)  => API.put(`/orders/${id}/status`, { status: s });

// ─── COMMENTS ──────────────────────────────────
export const getComments   = (animalId) => API.get(`/comments/${animalId}`);
export const addComment    = (data)     => API.post('/comments', data);
export const deleteComment = (id)       => API.delete(`/comments/${id}`);

// ─── MESSAGES ──────────────────────────────────
export const getMyMessages        = ()       => API.get('/messages/my');
export const getAllMessages        = ()       => API.get('/messages/all');
export const getUserMessages      = (userId) => API.get(`/messages/user/${userId}`);
export const sendMessage          = (data)   => API.post('/messages', data);

// ─── NOTIFICATIONS ─────────────────────────────
export const getNotifications = ()  => API.get('/notifications');
export const markAllRead      = ()  => API.put('/notifications/read-all');
