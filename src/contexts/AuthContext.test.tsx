import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const mockLogin = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockGetMe = vi.hoisted(() => vi.fn());
const storage = vi.hoisted(() => {
  let store: Record<string, string> = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] ?? null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
});

vi.mock('../api/index', () => ({
  authAPI: {
    login: mockLogin,
    logout: mockLogout,
  },
  userAPI: {
    getMe: mockGetMe,
  },
}));

describe('AuthContext', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: storage,
      configurable: true,
    });
  });

  // 매 테스트 이전에 로컬 스토리지 초기화
  beforeEach(() => {
    localStorage.clear();
    mockLogin.mockClear();
    mockLogout.mockClear();
    mockGetMe.mockClear();
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

  it('token 이 있으면 getMe 성공 후 user 복원', async () => {
    localStorage.setItem('token', 'mockToken');
    mockGetMe.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          user_email: 'user@goorm.io',
          user_name: '테스트',
          user_role: 'USER',
        },
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(mockGetMe).toHaveBeenCalled();
    expect(result.current.user?.user_email).toBe('user@goorm.io');
    expect(result.current.isLoading).toBe(false);
  });

  it('token 이 있지만 getMe 실패 시 인증 정보 제거', async () => {
    localStorage.setItem('token', 'expiredToken');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        user_email: 'stale@goorm.io',
        user_name: '만료 사용자',
        user_role: 'USER',
      }),
    );
    mockGetMe.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {});

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('login -> user 상태 및 localStorage 업데이트', async () => {
    mockLogin.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          user_email: 'user@goorm.io',
          user_name: '테스트',
          user_role: 'USER',
          token: 'mockToken',
        },
      },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('user@goorm.io', 'password');
    });
    expect(result.current.user?.user_email).toBe('user@goorm.io');
    expect(localStorage.getItem('token')).toBe('mockToken');
    expect(localStorage.getItem('user')).not.toBeNull();
  });

  it('admin 로그인 시 isAdmin = true', async () => {
    mockLogin.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          user_email: 'admin@goorm.io',
          user_name: '관리자',
          user_role: 'ADMIN',
          token: 'mockToken',
        },
      },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('admin@goorm.io', 'password');
    });
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user?.user_role).toBe('ADMIN');
  });

  it('user 로그인 시 isAdmin = false', async () => {
    mockLogin.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          user_email: 'user@goorm.io',
          user_name: '테스트',
          user_role: 'USER',
          token: 'mockToken',
        },
      },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('user@goorm.io', 'password');
    });
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.user?.user_role).toBe('USER');
  });

  it('logout 후 user null, localStorage 제거', async () => {
    mockLogin.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          user_email: 'admin@goorm.io',
          user_name: '관리자',
          user_role: 'ADMIN',
          token: 'mockToken',
        },
      },
    });
    mockLogout.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('admin@goorm.io', 'password');
    });
    await act(async () => {
      await result.current.logout();
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
