import axios from 'axios';
import type { User } from '../types';
import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';

/** Context 타입 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (user_email: string, user_password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** 인증 상태 Provider */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 새로고침 시 localStorage로부터 유저 복원 */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  /** 로그인
   * @now 목업 데이터
   * @todo 실제 api 호출
   */

  //목업-> 실제 api 호출로 변경
  const login = async (user_email: string, user_password: string) => {
  const res = await axios.post('/api/auth/login', { user_email, user_password }); 

  const { id, user_email: email, user_name, user_role, token } = res.data.data; 

  const user: User = { id, user_email: email, user_name, user_role }; 

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);
};
  /** 로그아웃 */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.user_role === 'ADMIN',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 상태 훅
 * @throws AuthProvide 외부에서 사용 시 에러
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth는 AuthProvider 에서만 사용할 수 있습니다.');
  return context;
}
