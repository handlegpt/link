/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import UploadModal from '@/components/shared/modals/upload-modal';
import { TinyLoader } from '@/components/utils/tiny-loader';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Balancer } from 'react-wrap-balancer';
import useUser from '@/hooks/useUser';
import { UserAvatarSetting } from '@/components/utils/avatar';
import { signalIframe } from '@/utils/helpers';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import CustomAlert from '@/components/shared/alerts/custom-alert';
import useMediaQuery from '@/hooks/use-media-query';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import { UserCircle, AtSign, FileText, Camera, Trash2 } from 'lucide-react';

const Settings = () => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [handle, setHandle] = useState('');

  const { isMobile } = useMediaQuery();

  const queryClient = useQueryClient();
  const { data: fetchedUser } = useUser(currentUser?.handle);

  useEffect(() => {
    setUsername(fetchedUser?.name);
    setBio(fetchedUser?.bio);
    setImage(fetchedUser?.image);
    setHandle(fetchedUser?.handle);
  }, [
    fetchedUser?.name,
    fetchedUser?.bio,
    fetchedUser?.image,
    fetchedUser?.handle,
  ]);

  // edit profile details
  const editMutation = useMutation(
    async ({ bio, username, image, handle }) => {
      await axios.patch('/api/edit', {
        bio,
        username,
        image,
        handle,
      });
    },
    {
      onError: () => {
        toast.error('操作失败');
      },
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('更新成功');
        signalIframe();
      },
    }
  );

  const handleSubmit = async () => {
    toast.loading('正在更新...');
    await editMutation.mutateAsync({ bio, username, image, handle });
  };

  // delete profile picture
  const handleDeletePfp = async () => {
    if (image === '') {
      toast.error('没有可删除的头像');
      return;
    } else {
      toast.loading('正在删除...');
      await editMutation.mutateAsync({ bio, username, image: '', handle });
    }
  };

  // delete user's account
  const deleteMutation = useMutation(
    async () => {
      await axios.delete('/api/edit');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        router.push('/register');
      },
    }
  );

  const handleDeleteUser = async () => {
    await toast.promise(deleteMutation.mutateAsync(), {
      loading: '正在删除账号...',
      success: '账号已删除 👋',
      error: '删除失败',
    });
    await signOut();
  };

  const deleteAlertProps = {
    action: handleDeleteUser,
    title: '确定要删除账号吗？',
    desc: '此操作无法撤销。删除账号将永久移除您的所有数据。',
    confirmMsg: '确认删除',
  };

  return (
    <>
      <Head>
        <title>个人设置 - Librelinks</title>
      </Head>
      <Layout>
        <div className="w-full lg:basis-3/5 pl-4 pr-4 border-r overflow-scroll">
          <div className="max-w-[690px] mx-auto my-10">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <UserCircle className="w-6 h-6" />
              个人资料
            </h3>
            <div className="mt-4 rounded-2xl border bg-white p-lg w-full h-auto pb-10">
              <div className="flex flex-col lg:flex-row gap-x-6 p-10">
                <div className="w-[100px] h-[100px] pb-6 rounded-full flex items-center mx-auto relative group">
                  {fetchedUser ? (
                    <>
                      <UserAvatarSetting />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button className="text-white p-2 rounded-full hover:bg-black hover:bg-opacity-20">
                              <Camera size={24} />
                            </button>
                          </Dialog.Trigger>
                          <UploadModal
                            value={image}
                            onChange={(image) => setImage(image)}
                            submit={handleSubmit}
                          />
                        </Dialog.Root>
                      </div>
                    </>
                  ) : (
                    <TinyLoader color="black" stroke={1} size={100} />
                  )}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleDeletePfp}
                    className="flex items-center justify-center gap-2 w-full lg:w-[490px] h-[45px] border border-red-200 
                    outline-none font-semibold text-red-500 bg-white p-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                    删除头像
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-6 max-w-[640px] mx-auto px-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    用户名
                  </label>
                  <input
                    value={username ?? ''}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleSubmit}
                    placeholder="请输入用户名"
                    className="outline-none w-full p-4 h-[50px] rounded-xl border-2 bg-gray-50 text-black focus:border-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    个性域名
                  </label>
                  <input
                    value={handle ?? ''}
                    onChange={(e) => setHandle(e.target.value)}
                    onBlur={handleSubmit}
                    placeholder="请输入个性域名"
                    className="outline-none w-full p-4 h-[50px] rounded-xl border-2 bg-gray-50 text-black focus:border-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    个人简介
                  </label>
                  <textarea
                    value={bio ?? ''}
                    onChange={(e) => setBio(e.target.value)}
                    onBlur={handleSubmit}
                    placeholder="介绍一下自己吧..."
                    className="outline-none w-full p-4 h-[120px] rounded-xl border-2 bg-gray-50 text-black focus:border-slate-900 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[690px] mx-auto my-10">
            <h3 className="text-xl font-semibold mb-1 text-red-500 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              危险区域
            </h3>
            <h3 className="mb-4 text-gray-600 text-sm">
              <Balancer>
                删除账号将永久移除您的页面和所有数据。
              </Balancer>
            </h3>
            <div className="w-full h-auto border border-red-200 bg-white rounded-xl p-6">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button
                    className="border-none w-full lg:w-[200px] rounded-xl h-auto p-3
                    text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    删除账号
                  </button>
                </AlertDialog.Trigger>
                <CustomAlert {...deleteAlertProps} />
              </AlertDialog.Root>
            </div>
          </div>
          {isMobile ? (
            <div className="h-[100px] mb-24" />
          ) : (
            <div className="h-[40px] mb-12" />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Settings;
