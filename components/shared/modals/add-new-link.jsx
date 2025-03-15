import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import Image from 'next/image';
import closeSVG from '@/public/close_button.svg';
import { isValidUrl, signalIframe } from '@/utils/helpers';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLinks from '@/hooks/useLinks';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import TooltipWrapper from '@/components/utils/tooltip';

const AddLinkModal = ({ selectedGroup }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSocial, setIsSocial] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [groupId, setGroupId] = useState(selectedGroup || '');

  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ?? null;
  const { data: userLinks } = useLinks(userId);

  const queryClient = useQueryClient();

  const order = userLinks?.length;

  // 获取分组列表
  const { data: groups } = useQuery({
    queryKey: ['linkGroups', userId],
    queryFn: async () => {
      const response = await axios.get('/api/link-groups');
      return response.data;
    },
    enabled: !!userId
  });

  const addLinkMutation = useMutation(
    async ({ title, url, order }) => {
      await axios.post('/api/links', {
        title,
        url,
        order,
        isSocial,
        groupId
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
        setTitle('');
        setUrl('');
        setIsSocial(false);
        setGroupId('');
        signalIframe();
      },
    }
  );

  const submitLink = async () => {
    if (title.trim() === '' || url.trim() === '') {
      toast.error('请填写完整信息');
      return;
    }
    await toast.promise(addLinkMutation.mutateAsync({ title, url, order }), {
      loading: '添加链接中',
      success: '链接添加成功',
      error: '发生错误',
    });
  };

  const handleUrlChange = (event) => {
    const urlValue = event.target.value;
    const URL = isValidUrl(urlValue);

    setUrl(urlValue);
    setUrlError(!URL);
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
        <Dialog.Title className="text-[17px] font-medium mb-8">
          添加新链接
        </Dialog.Title>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="text-[15px] w-[90px]" htmlFor="title">
            标题
          </label>
          <input
            className="text-[15px] w-full flex-1 rounded-[4px] border border-slate-200 px-[10px] py-2 shadow-[0_0_0_1px] shadow-slate-100 outline-none focus:shadow-[0_0_0_2px] focus:shadow-slate-200"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入链接标题"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="text-[15px] w-[90px]" htmlFor="url">
            链接
          </label>
          <input
            className={`text-[15px] w-full flex-1 rounded-[4px] border px-[10px] py-2 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${
              urlError
                ? 'border-red-200 shadow-red-100 focus:shadow-red-200'
                : 'border-slate-200 shadow-slate-100 focus:shadow-slate-200'
            }`}
            id="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="输入链接地址"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="text-[15px] w-[90px]" htmlFor="group">
            分组
          </label>
          <Select.Root value={groupId} onValueChange={setGroupId}>
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-[4px] px-[10px] py-2 text-[15px] leading-none h-9 gap-[5px] bg-white border border-slate-200 shadow-[0_0_0_1px] shadow-slate-100 hover:shadow-[0_0_0_1px] hover:shadow-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-slate-200 data-[placeholder]:text-slate-400 outline-none w-full"
              aria-label="分组"
            >
              <Select.Value placeholder="选择分组" />
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
                  <Select.Item
                    value=""
                    className="text-[13px] leading-none text-slate-600 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white cursor-pointer"
                  >
                    <Select.ItemText>无分组</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {groups?.map((group) => (
                    <Select.Item
                      key={group.id}
                      value={group.id}
                      className="text-[13px] leading-none text-slate-600 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white cursor-pointer"
                    >
                      <Select.ItemText>{group.name}</Select.ItemText>
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
          <label className="text-[15px] w-[90px]" htmlFor="social">
            社交链接
          </label>
          <div className="flex items-center">
            <TooltipWrapper content="社交链接将显示在个人资料顶部">
              <Switch.Root
                className="w-[42px] h-[25px] bg-slate-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
                id="social"
                checked={isSocial}
                onCheckedChange={setIsSocial}
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </TooltipWrapper>
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
              onClick={submitLink}
            >
              保存
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button
            className="text-slate-400 hover:text-slate-500 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:shadow-slate-200 focus:outline-none"
            aria-label="Close"
          >
            <Image src={closeSVG} alt="close dialog" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default AddLinkModal;
