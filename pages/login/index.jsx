import Link from 'next/link';
import Form from '@/components/shared/form/form';
import { Wand } from 'lucide-react';
import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>登录 - Librelinks</title>
        <meta name="description" content="登录到Librelinks，开始管理您的个人链接页面" />
        <meta name="keywords" content="Librelinks,登录,链接管理,个人主页" />
        <meta property="og:title" content="登录 - Librelinks" />
        <meta property="og:description" content="登录到Librelinks，开始管理您的个人链接页面" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl" role="dialog" aria-labelledby="login-heading">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <Link href="/" aria-label="返回首页">
              <Wand color="black" size={30} aria-hidden="true" />
            </Link>
            <h1 id="login-heading" className="text-xl font-semibold">登录到您的账户</h1>
            <p className="text-sm text-gray-500">
              开始打造您的专属在线形象✨
            </p>
          </div>
          <Form type="login" />
        </div>
      </main>
    </>
  );
}
