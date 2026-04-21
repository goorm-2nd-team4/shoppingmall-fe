import { useEffect, useState } from 'react';
import { Button, Text } from '@vapor-ui/core'; // IconButton을 버리고 일반 Button 사용
import { TrashIcon } from '@vapor-ui/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { cartAPI } from '../api';

const CartPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchCart = () => cartAPI.getList().then(res => setItems(res.data.data)).catch(() => {
    setItems([{ id: 1, product_name: '샘플 사과', product_price: 1000, product_count: 2 }]);
  });
  
  useEffect(() => { fetchCart(); }, []);

  const totalPrice = items.reduce((sum, item) => sum + (item.product_price * item.product_count), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4">
        <Text className="text-2xl font-bold mb-6 block">장바구니</Text>
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
              <div>
                <Text className="font-bold text-lg block">{item.product_name}</Text>
                <Text className="text-gray-500">{item.product_count}개 | {(item.product_price * item.product_count).toLocaleString()}원</Text>
              </div>
              {/* IconButton 대신 일반 Button을 사용하고 아이콘을 안에 넣습니다 */}
              <Button variant="ghost" className="text-red-500 p-2 hover:bg-red-50">
                <TrashIcon size={20} />
              </Button>
            </div>
          ))}
          
          <div className="mt-6 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <Text className="text-lg text-gray-600">총 결제 금액</Text>
              <Text className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</Text>
            </div>
            <Button color="primary" className="w-full h-14 text-lg font-bold" onClick={() => navigate('/payment')}>
              주문하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;