import { useEffect, useState } from 'react';
import { Button, Text } from '@vapor-ui/core';
import { TrashIcon } from '@vapor-ui/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { cartAPI } from '../api';

interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productCount: number;
  productPrice: number;
  subtotal: number;
}

interface Cart {
  cartId: number;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = () =>
    cartAPI
      .getList()
      .then((res) => {
        setCart(res.data.data);
        setError('');
      })
      .catch(() => {
        setCart(null);
        setError('장바구니를 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));

  useEffect(() => {
    fetchCart();
  }, []);

  // 주문하기 버튼 클릭 핸들러
  const handleOrderClick = () => {
    if (!cart || cart.items.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }

    // PaymentPage로 데이터 전달
    navigate('/payment', {
      state: {
        cart: cart,
        fromCart: true, // ★ 이 값이 true여야 결제 완료 후 장바구니가 비워집니다!
      },
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-2xl mx-auto px-4 py-10'>
        <Text className='text-2xl font-bold mb-6 block'>장바구니</Text>
        {isLoading && (
          <div className='rounded-lg border border-gray-200 bg-white py-20 text-center text-gray-500'>
            장바구니를 불러오는 중입니다.
          </div>
        )}
        {!isLoading && error && (
          <div className='rounded-lg border border-red-200 bg-red-50 py-20 text-center text-red-600'>
            {error}
          </div>
        )}
        {!isLoading && !error && (
          <div className='flex flex-col gap-4'>
            {cart?.items.map((item) => (
              <div
                key={item.cartItemId}
                className='bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm'
              >
                <div>
                  <Text className='font-bold text-lg block'>
                    {item.productName}
                  </Text>
                  <Text className='text-gray-500'>
                    {item.productCount}개 | {item.subtotal.toLocaleString()}원
                  </Text>
                </div>
                <Button
                  variant='ghost'
                  className='text-red-500 p-2 hover:bg-red-50'
                  onClick={() =>
                    cartAPI.delete(item.cartItemId).then(fetchCart)
                  }
                >
                  <TrashIcon size={20} />
                </Button>
              </div>
            ))}

            {/* 장바구니가 비었을 때 메시지 */}
            {cart?.items.length === 0 && (
              <div className='text-center py-20 bg-white rounded-lg border border-dashed border-gray-300'>
                <Text className='text-gray-400'>장바구니가 비어 있습니다.</Text>
              </div>
            )}

            <div className='mt-6 p-6 bg-white border border-gray-200 rounded-xl shadow-md'>
              <div className='flex justify-between items-center mb-6'>
                <Text className='text-lg text-gray-600'>총 결제 금액</Text>
                <Text className='text-2xl font-bold text-blue-600'>
                  {cart?.totalPrice.toLocaleString()}원
                </Text>
              </div>
              <Button
                color='primary'
                className='w-full h-14 text-lg font-bold'
                onClick={handleOrderClick} // 분리한 핸들러 연결
              >
                주문하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
