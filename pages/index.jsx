/* eslint-disable @next/next/no-img-element */
import GithubStar from '@/components/utils/github-star';
import { GithubIcon, GlobeIcon, TwitterIcon, ArrowRight, Sparkles, Link2, BarChart3, Palette } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

export const metadata = {
  title: 'Librelinks',
  description:
    'Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence.',
};

const features = [
  {
    title: "简单易用",
    description: "直观的界面设计，让您轻松管理所有链接",
    icon: <Link2 className="w-5 h-5" />
  },
  {
    title: "数据分析",
    description: "实时追踪访问数据，了解您的受众",
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    title: "个性化主题",
    description: "丰富的主题选项，展现独特的个人风格",
    icon: <Palette className="w-5 h-5" />
  }
];

const Home = () => {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated' ? true : false;

  return (
    <>
      <Head>
        <title>Librelinks | 一站式链接管理平台</title>
        {/* <!-- Open Graph (OG) meta tags --> */}
        <meta property="og:url" content="https://librelinks.vercel.app/" />
        <meta property="og:url" content="https://librelinks.me/" />
        <meta property="og:url" content="https://www.librelinks.me/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:site_name"
          content="Librelinks - The free & opensource link in bio tool"
        />
        <meta property="og:title" content="Librelinks" />
        <meta
          property="og:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />
        <meta
          property="og:image"
          content="https://librelinks.vercel.app/og.png"
          itemProp="image"
        />
        <meta
          property="og:image"
          itemprop="image"
          content="https://librelinks.me/og.png"
        />
        <meta
          property="og:image"
          itemprop="image"
          content="https://www.librelinks.me/og.png"
        />

        {/* <!-- Twitter Card meta tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@urdadx" />
        <meta name="twitter:creator" content="@urdadx" />
        <meta
          property="twitter:domain"
          content="https://librelinks.vercel.app/"
        />
        <meta property="twitter:domain" content="https://librelinks.me/" />
        <meta property="twitter:domain" content="https://www.librelinks.me/" />
        <meta property="twitter:url" content="https://librelinks.vercel.app/" />
        <meta name="twitter:title" content="Librelinks" />
        <meta
          name="twitter:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />
        <meta
          name="twitter:image"
          content="https://librelinks.vercel.app/og.png"
          itemProp="image"
        />
        <meta name="twitter:image" content="https://librelinks.me/og.png" />
        <meta name="twitter:image" content="https://www.librelinks.me/og.png" />
        <meta
          data-rh="true"
          name="twitter:image:alt"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />

        {/* <!-- LinkedIn meta tags --> */}
        <meta
          property="og:linkedin:image"
          content="https://librelinks.vercel.app/og.png"
        />
        <meta
          property="og:linkedin:image"
          content="https://librelinks.me/og.png"
        />
        <meta
          property="og:linkedin:image"
          content="https://www.librelinks.me/og.png"
        />
        <meta property="og:linkedin:title" content="Librelinks" />
        <meta
          property="og:linkedin:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />

        {/* <!-- Facebook meta tags --> */}
        <meta
          property="og:facebook:image"
          content="https://librelinks.vercel.app/og.png"
        />
        <meta
          property="og:facebook:image"
          content="https://librelinks.me/og.png"
        />
        <meta
          property="og:facebook:image"
          content="https://www.librelinks.me/og.png"
        />
        <meta property="og:facebook:title" content="Librelinks" />
        <meta
          property="og:facebook:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />

        {/* <!-- Instagram meta tags --> */}
        <meta
          property="og:instagram:image"
          content="https://librelinks.vercel.app/og.png"
        />
        <meta
          property="og:instagram:image"
          content="https://librelinks.me/og.png"
        />
        <meta
          property="og:instagram:image"
          content="https://www.librelinks.me/og.png"
        />
        <meta property="og:instagram:title" content="Librelinks" />
        <meta
          property="og:instagram:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />

        {/* <!-- Pinterest meta tags --> */}
        <meta
          property="og:pinterest:image"
          content="https://librelinks.vercel.app/og.png"
        />
        <meta
          property="og:pinterest:image"
          content="https://librelinks.me/og.png"
        />
        <meta
          property="og:pinterest:image"
          content="https://www.librelinks.me/og.png"
        />
        <meta property="og:pinterest:title" content="Librelinks" />
        <meta
          property="og:pinterest:description"
          content="Librelinks is an opensource link in bio tool that helps you easily manage your links, transforming your online presence."
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="relative">
          {/* 导航栏 */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
              <nav className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Librelinks
                  </span>
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    href={isAuthenticated ? '/user' : '/login'}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    免费注册
                  </Link>
                </div>
              </nav>
            </div>
          </div>

          {/* 主要内容 */}
          <main className="pt-32 pb-16">
            {/* Hero 部分 */}
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  <span className="inline-block">一个链接，</span>{' '}
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    连接所有
                  </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                  简单而强大的链接管理工具，帮助您创建专业的个人主页，展示您的所有社交媒体和重要链接。
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/register"
                    className="px-8 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2 group"
                  >
                    立即开始
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="https://github.com/urdadx/librelinks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    Star on GitHub
                  </a>
                </div>
              </div>

              {/* 预览图 */}
              <div className="mt-16 rounded-xl overflow-hidden shadow-2xl shadow-blue-100">
                <Image
                  src="/assets/new_shot.png"
                  alt="Librelinks 预览"
                  width={1200}
                  height={700}
                  className="w-full"
                />
              </div>

              {/* 特性部分 */}
              <div className="mt-32">
                <h2 className="text-3xl font-bold text-center text-slate-900">
                  为什么选择 Librelinks？
                </h2>
                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="relative p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors"
                    >
                      <div className="p-3 bg-blue-50 rounded-xl w-fit">
                        {feature.icon}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* 页脚 */}
          <footer className="bg-slate-900 py-12">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  <a
                    href="https://x.com/NerdyProgramme2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/urdadx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://urdadx.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <GlobeIcon className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-white/60 text-sm">
                  Made with ❤️ by{' '}
                  <a
                    href="https://twitter.com/NerdyProgramme2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    @urdadx
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
