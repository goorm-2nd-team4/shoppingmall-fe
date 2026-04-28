import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  // 매 테스트 이전에 로컬 스토리지 초기화
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('초기화 후 user null, isLoading false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('login -> user 상태 및 localStorage 업데이트', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('user@goorm.io', 'password');
    });
    expect(result.current.user?.user_email).toBe('user@goorm.io');
    expect(localStorage.getItem('token')).toBe('mockToken');
    expect(localStorage.getItem('user')).not.toBeNull();
  });

  it('admin 로그인 시 isAdmin = true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('admin@goorm.io', 'password');
    });
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user?.user_role).toBe('ADMIN');
  });

  it('user 로그인 시 isAdmin = false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('user@goorm.io', 'password');
    });
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.user?.user_role).toBe('USER');
  });

  it('logout 후 user null, localStorage 제거', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('admin@goorm.io', 'password');
    });
    act(() => {
      result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('AuthProvider 외부에서 useAuth 사용 불가', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth는 AuthProvider 에서만 사용할 수 있습니다.',
    );
  });
});
