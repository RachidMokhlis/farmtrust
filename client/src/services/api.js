// backward compat exports
export const getAnimals       = (p)    => api.getAnimals(p);
export const getAnimal        = (id)   => api.getAnimal(id);
export const getProducts      = ()     => api.getProducts();
export const getProduct       = (id)   => api.getProduct(id);
export const createProduct    = (d)    => api.createProduct(d);
export const updateProduct    = (id,d) => api.updateProduct(id,d);
export const deleteProduct    = (id)   => api.deleteProduct(id);
export const getPromotions    = ()     => api.getPromotions();
export const createPromotion  = (d)    => api.createPromotion(d);
export const deletePromotion  = (id)   => api.deletePromotion(id);
export const getOrders        = ()     => api.getOrders();
export const createOrder      = (d)    => api.createOrder(d);
export const updateOrderStatus= (id,s) => api.updateOrderStatus(id,s);
export const getComments      = (aid)  => api.getComments(aid);
export const addComment       = (d)    => api.addComment(d);
export const deleteComment    = (id)   => api.deleteComment(id);
export const getMyMessages    = ()     => api.getMyMessages();
export const getAllMessages    = ()     => api.getAllMessages();
export const getUserMessages  = (uid)  => api.getUserMessages(uid);
export const sendMessage      = (d)    => api.sendMessage(d);
export const getNotifications = ()     => api.getNotifications();
export const markAllRead      = ()     => api.markAllRead();
export const createAnimal     = (d)    => api.createAnimal(d);
export const updateAnimal     = (id,d) => api.updateAnimal(id,d);
export const deleteAnimal     = (id)   => api.deleteAnimal(id);
export const getAnimalLogs    = (id)   => api.getAnimalLogs(id);

export const addAnimalLog     = (id,d) => api.addAnimalLog(id,d);
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('ft_token');

const req = async (method, path, body, isForm = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Error');
  return json;
};

export const api = {
  // AUTH
  login:    (d)    => req('POST', '/auth/login', d),
  register: (d)    => req('POST', '/auth/register', d),
  me:       ()     => req('GET',  '/auth/me'),

  // ANIMALS
  getAnimals:   (p)    => req('GET',  `/animals${p ? '?'+new URLSearchParams(p) : ''}`),
  getAnimal:    (id)   => req('GET',  `/animals/${id}`),
  createAnimal: (fd)   => req('POST', '/animals', fd, true),
  updateAnimal: (id,d) => req('PUT',  `/animals/${id}`, d, d instanceof FormData),
  deleteAnimal: (id)   => req('DELETE',`/animals/${id}`),
  getAnimalLogs:(id)   => req('GET',  `/animals/${id}/logs`),
  addAnimalLog: (id,d) => req('POST', `/animals/${id}/logs`, d),

  // PRODUCTS
  getProducts:   ()      => req('GET',    '/products'),
  getProduct:    (id)    => req('GET',    `/products/${id}`),
  createProduct: (d)     => req('POST',   '/products', d),
  updateProduct: (id, d) => req('PUT',    `/products/${id}`, d),
  deleteProduct: (id)    => req('DELETE', `/products/${id}`),

  // PROMOTIONS
  getPromotions:   () => req('GET',  '/promotions'),
  createPromotion: (d)=> req('POST', '/promotions', d),
  deletePromotion: (id)=> req('DELETE',`/promotions/${id}`),

  // ORDERS
  getOrders:         ()       => req('GET',  '/orders'),
  createOrder:       (d)      => req('POST', '/orders', d),
  updateOrderStatus: (id, s)  => req('PUT',  `/orders/${id}/status`, { status: s }),

  // COMMENTS
  getComments:   (aid) => req('GET',    `/comments/${aid}`),
  addComment:    (d)   => req('POST',   '/comments', d),
  deleteComment: (id)  => req('DELETE', `/comments/${id}`),
  getRecentComments: () => req('GET',   '/comments/recent'),

  // MESSAGES
  getMyMessages:   ()   => req('GET',  '/messages/my'),
  getAllMessages:   ()   => req('GET',  '/messages/all'),
  getUserMessages: (uid)=> req('GET',  `/messages/user/${uid}`),
  sendMessage:     (d)  => req('POST', '/messages', d),

  // NOTIFICATIONS
  getNotifications: () => req('GET', '/notifications'),
  markAllRead:      () => req('PUT', '/notifications/read-all'),

  // STATS (admin)
  getStats: () => req('GET', '/stats'),
};
