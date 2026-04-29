import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const act = await vi.importActual('react-router-dom');
  return { ...act, useNavigate: () => mockNavigate };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAdmin: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../../components/Header', () => ({
  default: () => null,
}));

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );

describe('LoginPage', () => {
  // 매 테스트 이전 초기화
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it('폼 렌더링', () => {
    renderLoginPage();

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '회원가입' })).toBeInTheDocument();
  });

  it('이메일/비밀번호 입력', async () => {
    renderLoginPage();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');

    expect(screen.getByPlaceholderText('이메일')).toHaveValue('user@goorm.io');
    expect(screen.getByPlaceholderText('비밀번호')).toHaveValue('password');
  });

  it('로그인 성공 시 메인페이지("/") 이동', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    renderLoginPage();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('로그인 실패 시 에러 출력', async () => {
    mockLogin.mockRejectedValueOnce(new Error('로그인 실패'));

    renderLoginPage();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(
        screen.getByText('이메일 또는 패스워드가 올바르지 않습니다.'),
      ).toBeInTheDocument();
    });
  });
});
