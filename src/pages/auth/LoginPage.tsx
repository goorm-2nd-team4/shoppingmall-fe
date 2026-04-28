import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div
      className='relative flex min-h-screen items-center justify-center overflow-hidden'
      style={{
        background:
          'linear-gradient(135deg, #f8f6f2 0%, #eee9e0 50%, #e8e0d4 100%)',
      }}
    >
      <div className='relative w-full max-w-sm px-4'>
        <div className='mb-8 text-center'>
          <span className='text-5xl font-black tracking-[0.4em] text-stone-800'>
            GMART
          </span>
        </div>

        <div className='rounded-3xl bg-white/90 p-8 shadow-xl shadow-stone-200/60 ring-1 ring-stone-100 backdrop-blur-sm'>
          <h1 className='mb-7 text-center text-2xl font-bold tracking-[0.3em] text-stone-500'>
            LOGIN
          </h1>

          <form onSubmit={handleSubmit} className='flex w-full flex-col gap-5'>
            <input
              type='email'
              placeholder='이메일'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className='w-full rounded-xl border border-stone-400 px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-600 focus:ring-2 focus:ring-stone-100'
            />
            <input
              type='password'
              placeholder='비밀번호'
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              className='w-full rounded-xl border border-stone-400 px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-600 focus:ring-2 focus:ring-stone-100'
            />

            {error && (
              <div className='flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5'>
                <span className='text-red-400'>⚠</span>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='mt-1 w-full rounded-xl bg-stone-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-50 hover:cursor-pointer'
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className='my-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-stone-300' />
            <span className='text-xs tracking-widest text-stone-400'>OR</span>
            <div className='h-px flex-1 bg-stone-300' />
          </div>

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
  );
}