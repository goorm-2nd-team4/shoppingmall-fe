import { Button, Text } from '@vapor-ui/core';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 text-center">
      <Header />
      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl font-bold">✓</div>
        <div>
          <Text className="text-2xl font-bold block mb-2">주문 완료!</Text>
          <Text className="text-gray-500">정성을 다해 배송해 드리겠습니다.</Text>
        </div>
        <Button onClick={() => navigate('/')} size="xl">홈으로 돌아가기</Button>
      </div>
    </div>
  );
};
export default SuccessPage;