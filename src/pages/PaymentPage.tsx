import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Text } from '@vapor-ui/core';
import Header from '../components/Header';
import { orderAPI } from '../api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 1. 데이터 추출 (장바구니와 바로구매 공통 대응)
  const cart = state?.cart;
  const fromCart = state?.fromCart ?? false;

  // 장바구니나 상품 정보가 아예 없는 경우 방어 로직
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Text>주문 정보가 없습니다. 다시 시도해주세요.</Text>
        <Button onClick={() => navigate('/')}>홈으로 이동</Button>
      </div>
    );
  }

  // 주문 요약 텍스트 (예: '상품 A 외 2건')
  const firstItemName = cart.items[0]?.productName || '상품';
  const extraCount = cart.items.length - 1;
  const orderSummary = extraCount > 0 
    ? `${firstItemName} 외 ${extraCount}건` 
    : firstItemName;

  // 2. 결제 처리 함수
  const handlePayment = async () => {
    try {
      // 백엔드 OrderCreateRequest 규격에 100% 맞춤
      const payload = {
        items: cart.items.map((item: any) => ({
          productId: Number(item.productId),
          productName: String(item.productName),
          productCount: Number(item.productCount),
          productPrice: Number(item.productPrice)
        })),
        fromCart: fromCart // 장바구니에서 왔다면 true, 바로구매라면 false
      };

      await orderAPI.create(payload);
      navigate('/success');
    } catch (error: any) {
      console.error("결제 처리 중 오류:", error);
      alert(error.response?.data?.message || "결제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-xl mx-auto px-4 pt-10'>
        <Text className='text-2xl font-bold mb-6 block'>결제하기</Text>
        <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-md'>
          <div className='mb-6'>
            <Text className='font-bold text-gray-700 mb-2 block'>주문 정보</Text>
            <Text className='text-lg'>{orderSummary}</Text>
          </div>
          
          <div className='border-t py-6'>
            <Text className='font-bold text-gray-700 mb-2 block'>배송지</Text>
            <Text className='text-gray-500'>등록된 기본 배송지로 발송됩니다.</Text>
          </div>

          <div className='border-t pt-6 mb-8'>
            <div className='flex justify-between items-center'>
              <Text className='text-lg font-bold'>최종 결제 금액</Text>
              <Text className='text-2xl font-bold text-blue-600'>
                {cart.totalPrice?.toLocaleString()}원
              </Text>
            </div>
          </div>

          <Button
            color='primary'
            className='w-full h-14 text-lg font-bold'
            onClick={handlePayment}
          >
            {cart.totalPrice?.toLocaleString()}원 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;