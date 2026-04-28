import { Button, Text } from '@vapor-ui/core';
import { ShoppingCartIcon, UserIcon } from '@vapor-ui/icons'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleUserAction = () => {
    if (user) {
      // 로그인 상태라면 로그아웃 실행
      logout();
      alert('로그아웃 되었습니다.');
      navigate('/'); 
    } else {
      // 비로그인 상태라면 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <header className='flex justify-between items-center p-4 border-b border-gray-200 mb-6 bg-white shadow-sm'>
      <div className='cursor-pointer' onClick={() => navigate('/')}>
        <Text className='text-2xl font-bold text-blue-600'>gmart</Text>
      </div>
      <div className='flex gap-2'>
        <Button
          variant='ghost'
          onClick={() => navigate('/cart')}
          className='flex items-center gap-1'
        >
          <ShoppingCartIcon size={20} />
          <span className='hidden sm:inline'>장바구니</span>
        </Button>

        {/* 텍스트와 동작만 조건부로 변경 */}
        <Button
          variant='ghost'
          onClick={handleUserAction}
          className='flex items-center gap-1'
        >
          <UserIcon size={20} />
          <span className='hidden sm:inline'>
            {user ? '로그아웃' : '로그인'}
          </span>
        </Button>
      </div>
    </header>
  );
};

export default Header;