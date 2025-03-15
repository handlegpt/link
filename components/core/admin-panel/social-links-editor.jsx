import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { signalIframe } from '@/utils/helpers';
import toast from 'react-hot-toast';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLinks from '@/hooks/useLinks';
import { SocialCards } from '../user-profile/social-cards';

// 预定义的社交平台列表
const socialPlatforms = [
  { name: 'Twitter', icon: 'twitter', urlPrefix: 'https://twitter.com/' },
  { name: 'Facebook', icon: 'facebook', urlPrefix: 'https://facebook.com/' },
  { name: 'Instagram', icon: 'instagram', urlPrefix: 'https://instagram.com/' },
  { name: 'LinkedIn', icon: 'linkedin', urlPrefix: 'https://linkedin.com/in/' },
  { name: 'GitHub', icon: 'github', urlPrefix: 'https://github.com/' },
  { name: 'YouTube', icon: 'youtube', urlPrefix: 'https://youtube.com/' },
  { name: 'TikTok', icon: 'tiktok', urlPrefix: 'https://tiktok.com/@' },
  { name: 'Telegram', icon: 'telegram', urlPrefix: 'https://t.me/' },
  { name: 'Discord', icon: 'discord', urlPrefix: 'https://discord.gg/' },
  { name: 'WhatsApp', icon: 'whatsapp', urlPrefix: 'https://wa.me/' },
  { name: 'WeChat', icon: 'wechat', urlPrefix: 'weixin://' },
  { name: 'Weibo', icon: 'weibo', urlPrefix: 'https://weibo.com/' },
  { name: 'Email', icon: 'email', urlPrefix: 'mailto:' },
  { name: 'Shop', icon: 'shop', urlPrefix: 'https://' },
  { name: 'Snapchat', icon: 'snapchat', urlPrefix: 'https://snapchat.com/add/' },
  { name: 'Medium', icon: 'medium', urlPrefix: 'https://medium.com/@' },
  { name: 'Twitch', icon: 'twitch', urlPrefix: 'https://twitch.tv/' },
  { name: 'Bilibili', icon: 'bilibili', urlPrefix: 'https://space.bilibili.com/' },
  { name: 'Zhihu', icon: 'zhihu', urlPrefix: 'https://zhihu.com/people/' },
  { name: 'Douyin', icon: 'douyin', urlPrefix: 'https://douyin.com/user/' }
];

const AddSocialLinkModal = () => {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ?? null;
  const { data: userLinks } = useLinks(userId);
  const queryClient = useQueryClient();

  const selectedPlatform = socialPlatforms.find(p => p.name.toLowerCase() === platform.toLowerCase());

  const addLinkMutation = useMutation(
    async () => {
      const url = selectedPlatform.urlPrefix + username;
      await axios.post('/api/links', {
        title: platform,
        url,
        order: userLinks?.length || 0,
        isSocial: true
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
        setPlatform('');
        setUsername('');
        signalIframe();
      },
    }
  );

  const handleSubmit = async () => {
    if (!platform || !username) {
      toast.error('请填写完整信息');
      return;
    }
    await toast.promise(addLinkMutation.mutateAsync(), {
      loading: '添加社交链接中',
      success: '社交链接添加成功',
      error: '发生错误',
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
        <Dialog.Title className="text-[17px] font-medium mb-8">
          添加社交链接
        </Dialog.Title>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="text-[15px] w-[90px]" htmlFor="platform">
            平台
          </label>
          <Select.Root value={platform} onValueChange={setPlatform}>
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-[4px] px-[10px] py-2 text-[15px] leading-none h-9 gap-[5px] bg-white border border-slate-200 shadow-[0_0_0_1px] shadow-slate-100 hover:shadow-[0_0_0_1px] hover:shadow-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-slate-200 data-[placeholder]:text-slate-400 outline-none w-full"
              aria-label="社交平台"
            >
              <Select.Value placeholder="选择社交平台" />
              <Select.Icon className="text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-slate-500 cursor-default">
                  <ChevronUp className="h-4 w-4" />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-[5px]">
                  {socialPlatforms.map((platform) => (
                    <Select.Item
                      key={platform.name}
                      value={platform.name.toLowerCase()}
                      className="text-[13px] leading-none text-slate-600 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white cursor-pointer"
                    >
                      <Select.ItemText>{platform.name}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-slate-500 cursor-default">
                  <ChevronDown className="h-4 w-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="text-[15px] w-[90px]" htmlFor="username">
            用户名
          </label>
          <div className="flex-1 relative">
            {selectedPlatform && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {selectedPlatform.urlPrefix}
              </span>
            )}
            <input
              className="text-[15px] w-full flex-1 rounded-[4px] border border-slate-200 px-[10px] py-2 pl-[120px] shadow-[0_0_0_1px] shadow-slate-100 outline-none focus:shadow-[0_0_0_2px] focus:shadow-slate-200"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
            />
          </div>
        </fieldset>
        <div className="mt-[25px] flex justify-end gap-3">
          <Dialog.Close asChild>
            <button className="bg-slate-100 text-slate-500 hover:bg-slate-200 focus:shadow-slate-200 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              取消
            </button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <button
              className="bg-blue-600 text-white hover:bg-blue-700 focus:shadow-blue-200 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              onClick={handleSubmit}
            >
              保存
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

const SocialLinksEditor = () => {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ? currentUser.id : null;
  const { data: userLinks, isLoading } = useLinks(userId);
  const queryClient = useQueryClient();

  const [socialLinks, setSocialLinks] = useState([]);
  
  useEffect(() => {
    if (userLinks) {
      setSocialLinks(userLinks.filter(link => link.isSocial && !link.archived));
    }
  }, [userLinks]);

  const deleteLinkMutation = useMutation(
    async (linkId) => {
      await axios.delete(`/api/links/${linkId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['links', userId]);
        signalIframe();
      },
    }
  );

  const updateOrderMutation = useMutation(
    async (links) => {
      await axios.patch('/api/links/reorder', { links });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['links', userId]);
        signalIframe();
      },
    }
  );

  const handleDeleteLink = async (linkId) => {
    await toast.promise(deleteLinkMutation.mutateAsync(linkId), {
      loading: '删除社交链接中',
      success: '社交链接已删除',
      error: '删除失败',
    });
  };

  const handleReorder = async (newOrder) => {
    setSocialLinks(newOrder);
    const updatedLinks = newOrder.map((link, index) => ({
      id: link.id,
      order: index,
    }));
    await updateOrderMutation.mutateAsync(updatedLinks);
  };

  return (
    <div className="max-w-[640px] mx-auto my-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">社交链接</h3>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="bg-slate-900 font-medium flex justify-center gap-1 
              items-center h-10 px-6 rounded-3xl text-white hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" /> 添加社交链接
            </button>
          </Dialog.Trigger>
          <AddSocialLinkModal />
        </Dialog.Root>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {!isLoading ? (
          socialLinks?.length > 0 ? (
            <Reorder.Group axis="y" values={socialLinks} onReorder={handleReorder}>
              {socialLinks.map((link) => (
                <Reorder.Item
                  key={link.id}
                  value={link}
                  className="relative group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center p-4 cursor-move">
                    <GripVertical className="w-5 h-5 text-slate-400 mr-3" />
                    <div className="flex items-center flex-1">
                      <SocialCards
                        title={link.title}
                        url={link.url}
                        color="1F2937"
                        size="normal"
                      />
                      <div className="ml-4">
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-slate-500">{link.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="ml-2 w-8 h-8 bg-red-100 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-200"
                    >
                      ×
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <p className="text-slate-600">还没有添加任何社交链接</p>
              <p className="text-sm text-slate-500 mt-1">点击上方按钮添加您的第一个社交链接</p>
            </div>
          )
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl bg-slate-100 animate-pulse" />
          ))
        )}
      </div>
    </div>
  );
};

export default SocialLinksEditor; 