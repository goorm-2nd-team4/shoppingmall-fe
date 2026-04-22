import { Button, Text } from '@vapor-ui/core';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const PaymentPage = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-xl mx-auto px-4'>
        <Text className='text-2xl font-bold mb-6 block'>결제하기</Text>
        <div className='bg-white border border-gray-200 rounded-xl p-8 shadow-md'>
          <div className='mb-6'>
            <Text className='font-bold text-gray-700 mb-2 block'>
              주문 정보
            </Text>
            <Text className='text-lg'>맛있는 사과 외 1건</Text>
          </div>
          <div className='border-t py-6'>
            <Text className='font-bold text-gray-700 mb-2 block'>배송지</Text>
            <Text className='text-gray-500'>
              등록된 기본 배송지로 발송됩니다.
            </Text>
          </div>
          <div className='border-t pt-6 mb-8'>
            <div className='flex justify-between items-center'>
              <Text className='text-lg font-bold'>최종 결제 금액</Text>
              <Text className='text-2xl font-bold text-blue-600'>2,000원</Text>
            </div>
          </div>
          <Button
            color='primary'
            className='w-full h-14 text-lg font-bold'
            onClick={() => navigate('/success')}
          >
            2,000원 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PaymentPage;
