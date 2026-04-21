import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Text } from '@vapor-ui/core';
import Header from '../components/Header';
import { productAPI, cartAPI } from '../api';
import { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      productAPI.getDetail(id)
        .then(res => setProduct(res.data.data))
        .catch(() => {
          // 더미 데이터
          setProduct({
            id: Number(id),
            product_name: '테스트 상품 ' + id,
            product_price: 39000,
            product_category: 'tech',
            stock: 10
          });
        });
    }
  }, [id]);

  if (!product) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2 bg-gray-300 h-80 rounded-lg flex items-center justify-center text-white text-xl font-bold">
          상품 이미지
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <Text className="text-3xl font-bold block">{product.product_name}</Text>
          <Text className="text-2xl text-blue-600 font-bold block">{product.product_price.toLocaleString()}원</Text>
          <Text className="text-gray-500 block">무료 배송 | 재고 {product.stock}개 남음</Text>
          <div className="flex gap-4 mt-auto">
            <Button className="flex-1 h-12" variant="outline" onClick={() => { alert('장바구니에 담겼습니다!'); navigate('/cart'); }}>
              장바구니
            </Button>
            <Button className="flex-1 h-12" color="primary" onClick={() => navigate('/payment')}>
              바로 구매하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;