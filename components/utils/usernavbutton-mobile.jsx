import { Drawer } from 'vaul';
import { UserAvatar } from './avatar';
import Link from 'next/link';
import { User, LogOut, Shield } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useCurrentUser from '@/hooks/useCurrentUser';

const UserNavButtonMobile = () => {
  const session = useSession();
  const { data } = session;
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

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

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 p-1 hover:bg-gray-100">
          <UserAvatar />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[400px] flex-col rounded-t-[10px] bg-white">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">
                  {data?.user?.email}
                </p>
              </div>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg py-2 text-sm hover:bg-gray-100"
              >
                <User size={20} />
                个人设置
              </Link>
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 rounded-lg py-2 text-sm hover:bg-gray-100"
                >
                  <Shield size={20} />
                  管理后台
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} />
                退出登录
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default UserNavButtonMobile;
