import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useCurrentUser from '@/hooks/useCurrentUser';
import Head from 'next/head';
import { Users, Shield, Trash2, UserPlus, UserMinus } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import CustomAlert from '@/components/shared/alerts/custom-alert';

const AdminDashboard = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  // 检查管理员权限
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      router.push('/');
    }
  }, [currentUser, router]);

  // 获取所有用户
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/users');
      return response.data;
    },
    onError: (error) => {
      toast.error(error?.response?.data.message || '获取用户列表失败');
      if (error?.response?.status === 403) {
        router.push('/');
      }
    }
  });

  // 用户管理操作
  const userMutation = useMutation(
    async ({ userId, action }) => {
      await axios.patch('/api/admin/users', { userId, action });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        toast.success('操作成功');
      },
      onError: (error) => {
        toast.error(error?.response?.data.message || '操作失败');
      }
    }
  );

  const handleUserAction = async (userId, action) => {
    await userMutation.mutateAsync({ userId, action });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <>
      <Head>
        <title>管理后台 - Librelinks</title>
      </Head>
      <Layout>
        <div className="w-full lg:basis-3/5 pl-4 pr-4 border-r overflow-scroll">
          <div className="max-w-[960px] mx-auto my-10">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Users className="w-6 h-6" />
              用户管理
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-4">用户名</th>
                    <th className="p-4">邮箱</th>
                    <th className="p-4">域名</th>
                    <th className="p-4">角色</th>
                    <th className="p-4">注册时间</th>
                    <th className="p-4">总访问</th>
                    <th className="p-4">链接数</th>
                    <th className="p-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{user.name || '-'}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.handle || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                        }`}>
                          {user.role === 'admin' ? '管理员' : '用户'}
                        </span>
                      </td>
                      <td className="p-4">{new Date(user.createdAt).toLocaleDateString('zh-CN')}</td>
                      <td className="p-4">{user.totalViews}</td>
                      <td className="p-4">{user._count.links}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {user.role !== 'admin' ? (
                            <button
                              onClick={() => handleUserAction(user.id, 'promote')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="设为管理员"
                            >
                              <UserPlus size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'demote')}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="取消管理员"
                            >
                              <UserMinus size={18} />
                            </button>
                          )}
                          
                          <AlertDialog.Root>
                            <AlertDialog.Trigger asChild>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="删除用户"
                              >
                                <Trash2 size={18} />
                              </button>
                            </AlertDialog.Trigger>
                            <CustomAlert
                              action={() => handleUserAction(user.id, 'delete')}
                              title="确定要删除该用户吗？"
                              desc="此操作无法撤销。删除用户将永久移除其所有数据。"
                              confirmMsg="确认删除"
                            />
                          </AlertDialog.Root>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard; 