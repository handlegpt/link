import { UserAvatar } from './avatar';
import * as Popover from '@radix-ui/react-popover';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { User, LogOut, AlertCircle, Shield } from 'lucide-react';
import useMediaQuery from '@/hooks/use-media-query';
import { Drawer } from 'vaul';
import UserNavButtonMobile from './usernavbutton-mobile';
import useCurrentUser from '@/hooks/useCurrentUser';

const UserAccountNavDesktop = () => {
  const session = useSession();
  const { data } = session;
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const { isMobile } = useMediaQuery();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('您已退出登录');
    } catch (error) {
      toast.error('退出失败');
    } finally {
      router.push('/login');
    }
  };

  if (isMobile) {
    return <UserNavButtonMobile />;
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 p-1 hover:bg-gray-100">
          <UserAvatar />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[200px] rounded-xl bg-white p-2 shadow-lg"
          sideOffset={5}
          align="end"
        >
          <div className="flex flex-col gap-1">
            <div className="border-b px-2 pb-2">
              <p className="text-sm text-gray-500">
                {data?.user?.email}
              </p>
            </div>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100"
            >
              <User size={16} />
              个人设置
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100"
              >
                <Shield size={16} />
                管理后台
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default UserAccountNavDesktop;
