/** 유저 */
export interface User {
  id: number;
  user_email: string;
  user_name: string;
  user_role: 'USER' | 'ADMIN';
}

/** 상품 */
export interface Product {
  id: number;
  product_name: string;
  product_price: number;
  product_category: string;

  /** 재고 */
  stock: number; /* 변수명 product_stock에서 stock으로 변경 (api 명세서 기준) */
}


/** 로그인 요청 */
export interface LoginRequest {
  user_email: string;
  user_password: string;
}

/** 회원가입 요청 */
export interface SignupRequest {
  user_email: string;
  user_password: string;
  user_name: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  token: string;
  user: User;
}

/** 상품 등록/수정 데이터 */
export interface ProductFormData {
  product_name: string;
  product_price: number;
  product_category: string;
  product_stock: number;
}

/*장바구니*/
export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_count: number;
}
