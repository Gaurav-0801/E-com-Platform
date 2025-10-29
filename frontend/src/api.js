import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MOCK_USER_ID = 'user_123';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsAPI = {
  getAll: () => api.get('/products'),
};

export const cartAPI = {
  get: (userId = MOCK_USER_ID) => api.get(`/cart?userId=${userId}`),
  add: (productId, qty, userId = MOCK_USER_ID) => 
    api.post('/cart', { productId, qty, userId }),
  remove: (id, userId = MOCK_USER_ID) => 
    api.delete(`/cart/${id}?userId=${userId}`),
};

export const checkoutAPI = {
  submit: (data, userId = MOCK_USER_ID) => 
    api.post('/checkout', { ...data, userId }),
};

export default api;
