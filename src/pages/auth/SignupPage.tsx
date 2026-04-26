import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../../api/index';
import Header from '../../components/Header';

/**
 * 회원가입 페이지
 * - 이름, 이메일, 비밀번호, 비밀번호 확인 입력 폼
 * - 회원가입 API 호출 후 로그인 페이지로 리다이렉트
 */
export default function SignupPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 폼 제출 핸들러
   * - 입력값 검증
   * - 회원가입 API 호출
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userPassword !== userPasswordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.signup({
        user_email: userEmail,
        user_password: userPassword,
        user_password_confirm: userPasswordConfirm,
        user_name: userName,
      });
      navigate('/login');
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          '회원가입에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 입력 필드 공통 클래스
   */
  const inputClass =
    'w-full rounded-xl border border-stone-400 px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-600 focus:ring-2 focus:ring-stone-100';

  /**
   * 회원가입 폼
   * - 이름, 이메일, 비밀번호, 비밀번호 확인 입력 필드
   * - 에러 메시지 표시
   * - 회원가입 버튼
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
              SIGN UP
            </h1>

            <form
              onSubmit={handleSubmit}
              className='flex w-full flex-col gap-5'
            >
              {/* 이름 */}
              <input
                type='text'
                placeholder='이름'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className={inputClass}
              />

              {/* 이메일 */}
              <input
                type='email'
                placeholder='이메일'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className={inputClass}
              />

              {/* 비밀번호 */}
              <input
                type='password'
                placeholder='비밀번호'
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                className={inputClass}
              />

              {/* 비밀번호 확인 */}
              <input
                type='password'
                placeholder='비밀번호 확인'
                value={userPasswordConfirm}
                onChange={(e) => setUserPasswordConfirm(e.target.value)}
                required
                className={inputClass}
              />

              {/* 에러 메시지 */}
              {error && (
                <div className='flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5'>
                  <span className='text-red-400'>⚠</span>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              {/* 회원가입 버튼 */}
              <button
                type='submit'
                disabled={isLoading}
                className='mt-1 w-full rounded-xl bg-stone-800 py-2.5 text-sm font-semibold text-white transition-colors hover:cursor-pointer hover:bg-stone-700 disabled:opacity-50'
              >
                {isLoading ? '처리 중...' : '회원가입'}
              </button>
            </form>

            {/* 구분선 */}
            <div className='my-6 flex items-center gap-3'>
              <div className='h-px flex-1 bg-stone-300' />
              <span className='text-xs tracking-widest text-stone-400'>OR</span>
              <div className='h-px flex-1 bg-stone-300' />
            </div>

            {/* 로그인 링크 */}
            <p className='text-center text-sm'>
              <Link
                to='/login'
                className='font-semibold text-stone-500 underline-offset-2 hover:underline'
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
