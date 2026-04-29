import { useEffect, useState } from 'react';
import { Button, Text, Badge } from '@vapor-ui/core';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { productAPI } from '../api';
import { Product } from '../types';

const MainPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI
      .getAll()
      .then((res) => {
        setProducts(res.data.data);
        setError('');
      })
      .catch(() => {
        setProducts([]);
        setError('상품 목록을 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered =
    category === 'all'
      ? products
      : products.filter((p) => p.product_category === category);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex gap-2 mb-6'>
          {['all', 'food', 'tech'].map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'fill' : 'outline'}
              color='primary'
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? '전체' : cat === 'food' ? '식품' : '전자기기'}
            </Button>
          ))}
        </div>
        {isLoading && (
          <div className='rounded-xl border border-gray-200 bg-white px-6 py-16 text-center text-gray-500'>
            상품을 불러오는 중입니다.
          </div>
        )}
        {!isLoading && error && (
          <div className='rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center text-red-600'>
            {error}
          </div>
        )}
        {!isLoading && !error && filtered.length === 0 && (
          <div className='rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-gray-500'>
            등록된 상품이 없습니다.
          </div>
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className='bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all'
            >
              <Badge color='primary' className='mb-3'>
                {p.product_category}
              </Badge>
              <Text className='block font-bold text-lg mb-1'>
                {p.product_name}
              </Text>
              <Text className='block text-blue-600 font-bold text-xl'>
                {p.product_price.toLocaleString()}원
              </Text>
              <div className='mt-4 pt-4 border-t border-gray-100 flex justify-between items-center'>
                {/* product_stock에서 stock으로 변경됨 */}
                <Text className='text-sm text-gray-500'>재고: {p.stock}개</Text>
                <Text className='text-blue-500 text-sm font-medium'>
                  상세보기 →
                </Text>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
export default MainPage;
