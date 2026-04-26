import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import Header from '../../components/Header';

/**
 * 로그인 페이지
 * - 이메일, 비밀번호 입력 폼
 * - 로그인 API 호출 후 메인 페이지로 리다이렉트
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 컴포넌트 마운트 시 로컬 스토리지에서 토큰과 유저 정보 확인
   * - 토큰이 유효하면 로그인 상태 유지
   * - 토큰이 없거나 유효하지 않으면 로그인 상태 초기화
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(userEmail, userPassword);
      navigate('/');
    } catch {
      setError('이메일 또는 패스워드가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인 폼
   * - 이메일, 비밀번호 입력 필드
   * - 에러 메시지 표시
   * - 로그인 버튼
   */
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='relative w-full max-w-sm px-4'>
          {/* 사이트 명 */}
          <div className='mb-8 text-center'>
            <span className='text-5xl font-black tracking-[0.4em] text-stone-800'>
              GMART
            </span>
          </div>

          {/* 카드 */}
          <div className='rounded-3xl bg-white/90 p-8 shadow-xl shadow-stone-200/60 ring-1 ring-stone-100 backdrop-blur-sm'>
            <h1 className='mb-7 text-center text-2xl font-bold tracking-[0.3em] text-stone-500'>
              LOGIN
            </h1>

            <form
              onSubmit={handleSubmit}
              className='flex w-full flex-col gap-5'
            >
              {/* 이메일 */}
              <div className='flex flex-col gap-1'>
                <input
                  type='email'
                  placeholder='이메일'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className='w-full rounded-xl border border-stone-400 px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-600 focus:ring-2 focus:ring-stone-100'
                />
              </div>

              {/* 패스워드 */}
              <div className='flex flex-col gap-1'>
                <input
                  type='password'
                  placeholder='비밀번호'
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                  className='w-full rounded-xl border border-stone-400 px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-600 focus:ring-2 focus:ring-stone-100'
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className='flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5'>
                  <span className='text-red-400'>⚠</span>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type='submit'
                disabled={isLoading}
                className='mt-1 w-full rounded-xl bg-stone-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-50 hover:cursor-pointer'
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 구분선 */}
            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-stone-300' />
              <span className='text-xs tracking-widest text-stone-400'>OR</span>
              <div className='h-px flex-1 bg-stone-300' />
            </div>

            {/* 회원가입 링크 */}
            <p className='text-center text-sm'>
              <Link
                to='/signup'
                className='font-semibold text-stone-500 underline-offset-2 hover:underline'
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
