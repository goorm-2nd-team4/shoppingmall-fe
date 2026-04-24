import axios from 'axios';
import { SignupRequest, LoginRequest } from '../types';

const api = axios.create({
  // 백엔드 서버 들어갈 곳
  baseURL: 'http://localhost:8080/api',
});

/** 인증 관련 */
export const authAPI = {
  signup: (data: SignupRequest) => api.post('/auth/register', data),
  login: (data: LoginRequest) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

/** 상품 관련 */
export const productAPI = {
  getAll: () => api.get('/products'),
  getDetail: (id: string | number) => api.get(`/products/${id}`),
};

/** 장바구니 관련 */
export const cartAPI = {
  getList: () => api.get('/carts'),
  add: (productId: number, count: number) =>
    api.post('/carts', { product_id: productId, product_count: count }),
  delete: (id: number) => api.delete(`/carts/${id}`),
};

export default api;
