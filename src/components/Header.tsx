import { Button, Text } from '@vapor-ui/core';
import { ShoppingCartIcon, UserIcon } from '@vapor-ui/icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
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
          <ShoppingCartIcon size={20} />{' '}
          <span className='hidden sm:inline'>장바구니</span>
        </Button>
        <Button
          variant='ghost'
          onClick={() => navigate('/login')}
          className='flex items-center gap-1'
        >
          <UserIcon size={20} />{' '}
          <span className='hidden sm:inline'>로그인</span>
        </Button>
      </div>
    </header>
  );
};
export default Header;
