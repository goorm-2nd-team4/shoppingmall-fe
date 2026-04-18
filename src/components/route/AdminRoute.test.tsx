import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

vi.mock('../../contexts/AuthContext');

const mockUseAuth = vi.mocked(useAuth);

const mockAuthValue = (override: Partial<ReturnType<typeof useAuth>>) =>
  mockUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...override,
  });

const mockAdmin: User = {
  id: 1,
  user_email: 'admin@goorm.io',
  user_name: 'admin',
  user_role: 'ADMIN',
};

const mockUser: User = {
  id: 2,
  user_email: 'user@goorm.io',
  user_name: 'admin',
  user_role: 'ADMIN',
};

const renderAdminRoute = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path='/admin'
          element={
            <AdminRoute>
              <div>관리자 페이지</div>
            </AdminRoute>
          }
        />
        <Route path='/login' element={<div>로그인 페이지</div>} />
        <Route path='/' element={<div>메인 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('AdminRoute', () => {
  it('비로그인 시 /login 으로 리다이렉트', () => {
    mockAuthValue({ user: null });
    renderAdminRoute();
    expect(screen.getByText('로그인 페이지')).toBeInTheDocument();
  });

  it('USER 권한으로 접근 시 / 로 리다이렉트', () => {
    mockAuthValue({ user: mockUser, isAdmin: false });
    renderAdminRoute();
    expect(screen.getByText('메인 페이지')).toBeInTheDocument();
  });

  it('ADMIN 권한으로 접근 시 children 렌더링', () => {
    mockAuthValue({ user: mockAdmin, isAdmin: true });
    renderAdminRoute();
    expect(screen.getByText('관리자 페이지')).toBeInTheDocument();
  });
});
