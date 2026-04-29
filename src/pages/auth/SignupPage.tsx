import axios from 'axios';
import { Card, TextInput, Button } from '@vapor-ui/core';
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
      await axios.post('/api/auth/register', {
        user_name: userName,
        user_email: userEmail,
        user_password: userPassword,
        user_password_confirm: userPasswordConfirm,
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
   * 회원가입 폼
   * - 이름, 이메일, 비밀번호, 비밀번호 확인 입력 필드
   * - 에러 메시지 표시
   * - 회원가입 버튼
   */
  return (
    <div className='flex min-h-screen flex-col bg-gray-100'>
      <Header />
      <div className='flex flex-1 items-center justify-center'>
        <div className='relative w-full max-w-sm px-4'>
          {/* 사이트 명 */}
          <div className='mb-8 text-center'>
            <span className='text-5xl font-black tracking-[0.4em] text-stone-800'>
              GMART
            </span>
          </div>

          {/* 카드 */}
          <Card.Root>
            <Card.Header>
              <h1 className='text-center text-2xl font-bold tracking-[0.3em] text-stone-500'>
                SIGN UP
              </h1>
            </Card.Header>
            <Card.Body>
              <form
                onSubmit={handleSubmit}
                className='flex w-full flex-col gap-5'
              >
                {/* 이름 */}
                <TextInput
                  type='text'
                  placeholder='이름'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />

                {/* 이메일 */}
                <TextInput
                  type='email'
                  placeholder='이메일'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />

                {/* 비밀번호 */}
                <TextInput
                  type='password'
                  placeholder='비밀번호'
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />

                {/* 비밀번호 확인 */}
                <TextInput
                  type='password'
                  placeholder='비밀번호 확인'
                  value={userPasswordConfirm}
                  onChange={(e) => setUserPasswordConfirm(e.target.value)}
                  required
                  invalid={!!error}
                />

                {/* 에러 메시지 */}
                {error && (
                  <div className='flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5'>
                    <span className='text-red-400'>⚠</span>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                )}

                {/* 회원가입 버튼 */}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='mt-1 w-full'
                >
                  {isLoading ? '처리 중...' : '회원가입'}
                </Button>
              </form>
            </Card.Body>
            <Card.Footer>
              {/* 로그인 링크 */}
              <div className='flex flex-col gap-4'>
                <p className='text-center text-sm'>
                  <Link
                    to='/login'
                    className='font-semibold text-stone-500 underline-offset-2 hover:underline'
                  >
                    로그인
                  </Link>
                </p>
              </div>
            </Card.Footer>
          </Card.Root>
        </div>
      </div>
    </div>
  );
}

