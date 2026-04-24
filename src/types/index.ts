/** 유저 */
export interface User {
  id: number;
  user_email: string; // id -> email
  user_name: string;
  user_role: 'USER' | 'ADMIN';
}

/** 상품 */
export interface Product {
  id: number;
  product_name: string;
  product_price: number;
  product_category: string;
  product_detail: string;
  stock: number;
}

/** 로그인 요청 */
export interface LoginRequest {
  user_email: string; // user_id -> user_email
  user_password: string; // user_pw -> user_password
}

/** 회원가입 요청 */
export interface SignupRequest {
  user_email: string;
  user_password: string;
  user_password_confirm: string; // 추가됨
  user_name: string;
}

/** 상품 등록/수정 데이터 */
export interface ProductFormData {
  product_name: string;
  product_price: number;
  product_category: string;
  stock: number;
  product_detail: string;
}

/** 장바구니 아이템 */
export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_count: number;
}
