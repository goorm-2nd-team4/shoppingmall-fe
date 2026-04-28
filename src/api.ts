import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 포트 8080 기준
});

export const productAPI = {
  getAll: () => api.get('/products'),
  getDetail: (id: string) => api.get(`/products/${id}`),
};

export const cartAPI = {
  getList: () => api.get('/cart'),

  add: (productId: number, count: number) =>
    api.post('/cart/items', {
      productId,
      productCount: count,
    }),

  delete: (id: number) => api.delete(`/cart/items/${id}`),
};

/** 주문 관련 */
export const orderAPI = {
  // 주문 생성 
  create: (data: { items: { productId: number; productCount: number }[]; fromCart: boolean }) => 
    api.post('/orders', data),
  
  // 내 주문 내역 조회
  getMyOrders: () => api.get('/orders/my'),
  
  // 주문 상세 조회
  getDetail: (id: number) => api.get(`/orders/${id}`),
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
