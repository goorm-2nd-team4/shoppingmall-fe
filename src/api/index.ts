import axios from 'axios';
import { SignupRequest, LoginRequest, ProductFormData } from '../types';

const api = axios.create({
  // 백엔드 서버 들어갈 곳
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
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
  create: (data: ProductFormData) => api.post('/products', data),
  update: (id: string | number, data: Partial<ProductFormData>) =>
    api.patch(`/products/${id}`, data),
  delete: (id: string | number) => api.delete(`/products/${id}`),
};

/** 장바구니 관련 */
export const cartAPI = {
  getList: () => api.get('/carts'),
  add: (productId: number, count: number) =>
    api.post('/carts', { product_id: productId, product_count: count }),
  delete: (id: number) => api.delete(`/carts/${id}`),
};

export const adminMemberAPI = {
  // GET /api/admin/members → { totalCount, adminCount, members: MemberResponse[] }
  getAll: () => api.get('/admin/members'),

  // PATCH /api/admin/members/{id}/role → body: { role: 'USER' | 'ADMIN' }
  updateRole: (id: number, role: 'USER' | 'ADMIN') =>
    api.patch(`/admin/members/${id}/role`, { role }),

  // DELETE /api/admin/members/{id}
  delete: (id: number) => api.delete(`/admin/members/${id}`),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
};

export default api;
