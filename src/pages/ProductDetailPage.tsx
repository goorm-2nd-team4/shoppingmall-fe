import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Text } from '@vapor-ui/core';
import Header from '../components/Header';
import { cartAPI, productAPI } from '../api';
import { Product } from '../types';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (id) {
      productAPI
        .getDetail(id)
        .then((res) => setProduct(res.data.data))
        .catch(() => {
          setProduct({
            id: Number(id),
            product_name: '샘플 상품 ' + id,
            product_price: 39000,
            product_category: 'tech',
            product_detail: '성우님 명세서에 맞춘 상품 상세 설명입니다.',
            stock: 10,
          });
        });
    }
  }, [id]);

  // 장바구니 담기 로직
  const handleAddCart = async () => {
    if (!product) return;
    try {
      await cartAPI.add(product.id, count);
      navigate('/cart');
    } catch {
      alert('장바구니 담기에 실패했습니다. 로그인 여부를 확인해주세요.');
    }
  };

  if (!product)
    return <div className='p-10 text-center text-gray-500'>불러오는 중...</div>;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-10'>
        <div className='w-full md:w-1/2 bg-gray-300 h-80 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-inner'>
          상품 이미지
        </div>
        <div className='w-full md:w-1/2 flex flex-col gap-6'>
          <Text className='text-3xl font-bold block leading-tight'>
            {product.product_name}
          </Text>
          <Text className='text-2xl text-blue-600 font-bold block'>
            {product.product_price.toLocaleString()}원
          </Text>
          <div className='py-4 border-t border-b border-gray-100'>
            <Text className='text-gray-600 block leading-relaxed'>
              {product.product_detail}
            </Text>
          </div>
          <Text className='text-gray-500 block'>
            무료 배송 | 현재 재고 {product.stock}개
          </Text>

          {/* 수량 선택 */}
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={() => setCount((c) => Math.max(1, c - 1))}>-</Button>
            <Text className='text-lg font-bold'>{count}</Text>
            <Button variant='outline' onClick={() => setCount((c) => Math.min(product.stock, c + 1))}>+</Button>
          </div>

          {/* 이 부분이 수정된 버튼 영역입니다! */}
          <div className='flex gap-4 mt-auto'>
            <Button
              className='flex-1 h-12'
              variant='outline'
              onClick={handleAddCart}
            >
              장바구니
            </Button>
            <Button
              className='flex-1 h-12'
              color='primary'
              onClick={() => {
                if (!product) return;
                const orderData = {
                  items: [{
                    productId: product.id,
                    productName: product.product_name,
                    productPrice: product.product_price,
                    productCount: count
                  }],
                  totalPrice: product.product_price * count
                };
                navigate('/payment', { 
                  state: { 
                    cart: orderData, 
                    fromCart: false 
                  } 
                });
              }}
            >
              바로 구매하기
            </Button>
          </div>
          {/* 버튼 영역 끝 */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;