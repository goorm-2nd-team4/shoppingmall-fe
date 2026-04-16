import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import { AdminRoute } from './components/route/AdminRoute';
import MembersManagePage from './pages/admin/MembersManagePage';
import ProductsManagePage from './pages/admin/ProductsManagePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 로그인/회원가입 페이지 */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />

          {/* 관리자 페이지 */}
          <Route
            path='/admin/members'
            element={
              <AdminRoute>
                <MembersManagePage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <ProductsManagePage />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
