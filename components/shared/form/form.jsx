import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import LoadingDots from '@/components/utils/loading-dots';
import Link from 'next/link';
import GoogleIcon from '@/components/utils/google-icon';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Form({ type }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams?.get('next');

  useEffect(() => {
    const error = searchParams?.get('error');
    error && toast.error(error);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'register') {
        // 处理注册
        await axios.post('/api/auth/register', {
          email,
          password,
          name,
        });
        toast.success('注册成功！');
        // 注册成功后自动登录
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        router.push('/admin');
      } else {
        // 处理登录
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
        } else {
          router.push('/admin');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        {type === 'register' && (
          <input
            type="text"
            placeholder="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`${
            isLoading
              ? 'cursor-not-allowed border-gray-200 bg-gray-100'
              : 'border-black bg-black text-white hover:bg-white hover:text-black'
          } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
        >
          {isLoading ? (
            <LoadingDots color="#808080" />
          ) : (
            <p>{type === 'login' ? '登录' : '注册'}</p>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">或</span>
        </div>
      </div>

      <button
        onClick={() => {
          setIsLoading(true);
          signIn('google', {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        className="flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white text-sm transition-all hover:bg-gray-50"
      >
        <GoogleIcon />
        <span className="ml-2">使用Google账号继续</span>
      </button>

      {type === 'login' ? (
        <p className="text-center text-sm text-gray-600">
          还没有账号？{' '}
          <Link href="/register" className="font-semibold text-gray-800">
            注册
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600">
          已有账号？{' '}
          <Link href="/login" className="font-semibold text-gray-800">
            登录
          </Link>
        </p>
      )}
    </div>
  );
}
