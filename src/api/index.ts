import axios from 'axios';

const api = axios.create({
  // 백엔드 주소 서버를 8080으로 설정
  baseURL: 'http://localhost:8080/api',
});

export const authAPI = {
  // 회원가입: user_id, user_pw, user_name 필수
  signup: (data: { user_id: string; user_pw: string; user_name: string }) =>
    api.post('/auth/register', data),

  // 로그인: user_id, user_pw 필수
  login: (data: { user_id: string; user_pw: string }) =>
    api.post('/auth/login', data),

  // 로그아웃
  logout: () => api.post('/auth/logout'),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getDetail: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  getList: () => api.get('/carts'),
  add: (productId: number, count: number) =>
    api.post('/carts', { product_id: productId, product_count: count }),
  update: (id: number, count: number) =>
    api.patch(`/carts/${id}`, { product_count: count }),
  delete: (id: number) => api.delete(`/carts/${id}`),
  deleteAll: () => api.delete('/carts'),
};

export const orderAPI = {
  getList: () => api.get('/orders'),
  getDetail: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

export const adminAPI = {
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

export default api;
