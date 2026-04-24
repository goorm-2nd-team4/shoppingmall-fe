import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import { AdminRoute } from './components/route/AdminRoute';
import MembersManagePage from './pages/admin/MembersManagePage';
import ProductsManagePage from './pages/admin/ProductsManagePage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/success' element={<SuccessPage />} />

          {/* 로그인/회원가입 페이지 */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />

          {/* 관리자 페이지 */}
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <Outlet />
              </AdminRoute>
            }
          >
            <Route path='members' element={<MembersManagePage />} />
            <Route path='products' element={<ProductsManagePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
