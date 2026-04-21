import { useEffect, useState } from 'react';
import { Button, Text, Badge } from '@vapor-ui/core';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { productAPI } from '../api';
import { Product } from '../types';

const MainPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll().then(res => setProducts(res.data.data)).catch(() => {
      setProducts([
        { id: 1, product_name: '사과', product_price: 1000, product_category: 'food', product_stock: 50 },
        { id: 2, product_name: '키보드', product_price: 39000, product_category: 'tech', product_stock: 10 },
      ]);
    });
  }, []);

  const filtered = category === 'all' ? products : products.filter(p => p.product_category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 mb-6">
          {['all', 'food', 'tech'].map(cat => (
            <Button 
              key={cat} 
              variant={category === cat ? 'fill' : 'outline'} 
              color="primary"
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? '전체' : cat === 'food' ? '식품' : '전자기기'}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div 
              key={p.id} 
              onClick={() => navigate(`/product/${p.id}`)} 
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all"
            >
              <Badge color="primary" className="mb-3">{p.product_category}</Badge>
              <Text className="block font-bold text-lg mb-1">{p.product_name}</Text>
              <Text className="block text-blue-600 font-bold text-xl">{p.product_price.toLocaleString()}원</Text>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <Text className="text-sm text-gray-500">재고: {p.product_stock}개</Text>
                <Text className="text-blue-500 text-sm font-medium">상세보기 →</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MainPage;