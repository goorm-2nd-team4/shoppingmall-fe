import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 포트 8080 기준
});

export const productAPI = {
  getAll: () => api.get('/products'),
  getDetail: (id: string) => api.get(`/products/${id}`),
};

export const cartAPI = {
  getList: () => api.get('/carts'),
  add: (productId: number, count: number) => api.post('/carts', { product_id: productId, product_count: count }),
  delete: (id: number) => api.delete(`/carts/${id}`),
};