import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from './SignupPage';



const renderSignupPage = () =>
  render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  );

describe('SignupPage', () => {


  it('폼 렌더링', () => {
    renderSignupPage();

    expect(screen.getByPlaceholderText('이름')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호 확인')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '회원가입' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('회원가입 성공 시 /login 으로 이동', async () => {
    renderSignupPage();

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('이름'), '홍길동');
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');
    await user.type(screen.getByPlaceholderText('비밀번호 확인'), 'password');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
    });
  });

  it('비밀번호 다르면 에러 출력', async () => {
    renderSignupPage();

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('이름'), '홍길동');
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');
    await user.type(
      screen.getByPlaceholderText('비밀번호 확인'),
      'passwordDiff',
    );
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(
      screen.getByText('비밀번호가 일치하지 않습니다.'),
    ).toBeInTheDocument();
  });

  it('비밀번호 다르면 /login navigate 미호출', async () => {
    renderSignupPage();

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('이름'), '홍길동');
    await user.type(screen.getByPlaceholderText('이메일'), 'user@goorm.io');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'password');
    await user.type(
      screen.getByPlaceholderText('비밀번호 확인'),
      'passwordDiff',
    );
    await user.click(screen.getByRole('button', { name: '회원가입' }));

  });
});
