import type { User } from '../types';
import { createContext, useContext, useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { authAPI, userAPI } from '../api/index';

/** Context 타입 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (user_email: string, user_password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 인증 상태를 관리하는 Context Provider
 * - 로그인 상태 유지: 새로고침 시 localStorage에서 토큰과 유저 정보 확인
 * - 로그인: API 호출 후 토큰과 유저 정보 저장
 * - 로그아웃: API 호출 후 토큰과 유저 정보 제거
 * - 인증 상태와 로그인/로그아웃 함수를 하위 컴포넌트에 제공
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 새로고침 시 localStorage로부터 유저 복원 */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    userAPI
      .getMe()
      .then((res) => {
        const { id, email, name, role } = res.data.data;
        const user: User = {
          id,
          user_email: email,
          user_name: name,
          user_role: role,
        };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * AuthAPI의 로그인 호출 후 토큰과 유저 정보 저장
   * @param user_email
   * @param user_password
   */
  const login = async (user_email: string, user_password: string) => {
    const res = await authAPI.login({ user_email, user_password });
    const { token, ...userData } = res.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * AuthAPI의 로그아웃 호출 후 토큰과 유저 정보 제거
   */
  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * AuthContext.Provider로 인증 상태와 로그인/로그아웃 함수를 하위 컴포넌트에 제공
   */
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
