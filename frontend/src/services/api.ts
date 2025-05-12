import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restaurant endpoints
export const restaurantApi = {
  getAll: () => api.get('/restaurants'),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  create: (data: any) => api.post('/restaurants', data),
  update: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
  delete: (id: string) => api.delete(`/restaurants/${id}`),
};

// Menu endpoints
export const menuApi = {
  getCategories: () => api.get('/menu/categories'),
  createCategory: (data: any) => api.post('/menu/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/menu/categories/${id}`),
  getItems: () => api.get('/menu/items'),
  createItem: (data: any) => api.post('/menu/items', data),
  updateItem: (id: string, data: any) => api.put(`/menu/items/${id}`, data),
  deleteItem: (id: string) => api.delete(`/menu/items/${id}`),
};

// Order endpoints
export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here (e.g., show notifications)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api; 