import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import React from 'react';
import { toastManager } from '../../lib/toastManager';

/**
 * 어드민 권한을 필요로 하는 라우트
 * 비로그인 시 로그인 페이지로 리다이렉트
 * USER 접근 시 메인페이지로 리다이렉트
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      toastManager.add({
        title: '접근 권한이 없습니다.',
        colorPalette: 'danger',
      });
    }
  }, [isLoading, user, isAdmin]);

  if (isLoading)
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500' />
      </div>
    );
  if (!user) return <Navigate to='/login' replace />;
  if (!isAdmin) return <Navigate to='/' replace />;

  return <>{children}</>;
}
