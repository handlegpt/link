import { Plus, FolderPlus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AddLinkModal from '../../shared/modals/add-new-link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from './link';
import useCurrentUser from '@/hooks/useCurrentUser';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import useLinks from '@/hooks/useLinks';
import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { signalIframe } from '@/utils/helpers';
import toast from 'react-hot-toast';
import LinkSkeleton from './link-skeleton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const LinksEditor = () => {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ? currentUser.id : null;
  const [selectedGroup, setSelectedGroup] = useState(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const { data: userLinks, isLoading } = useLinks(userId);
  const queryClient = useQueryClient();

  // 获取分组列表
  const { data: groups } = useQuery({
    queryKey: ['linkGroups', userId],
    queryFn: async () => {
      const response = await axios.get('/api/link-groups');
      return response.data;
    },
    enabled: !!userId
  });

  // 创建分组
  const createGroupMutation = useMutation(
    async (name) => {
      await axios.post('/api/link-groups', {
        name,
        order: groups?.length || 0
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['linkGroups', userId]);
        toast.success('分组创建成功');
      }
    }
  );

  const handleCreateGroup = async () => {
    const name = prompt('请输入分组名称');
    if (name) {
      await createGroupMutation.mutateAsync(name);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const activeIndex = userLinks.findIndex((link) => link.id === active.id);
      const overIndex = userLinks.findIndex((link) => link.id === over.id);
      const newLinks = arrayMove(userLinks, activeIndex, overIndex);

      queryClient.setQueryData(['links', currentUser?.id], () => newLinks);
      await toast.promise(updateLinksOrderMutation.mutateAsync(newLinks), {
        loading: '同步更改中',
        success: '更改已同步',
        error: '发生错误',
      });
    }
  };

  const updateLinksOrderMutation = useMutation(
    async (newLinks) => {
      await axios.put(`/api/links`, {
        links: newLinks,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['links', currentUser?.id]);
        signalIframe();
      },
    }
  );

  const filteredLinks = selectedGroup
    ? userLinks?.filter(link => link.groupId === selectedGroup)
    : userLinks?.filter(link => !link.groupId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="max-w-[640px] mx-auto my-10">
        <div className="flex justify-between items-center mb-6">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="bg-slate-900 font-medium flex justify-center gap-1 
                items-center h-12 px-8 rounded-3xl text-white hover:bg-slate-700"
              >
                <Plus /> 添加链接
              </button>
            </Dialog.Trigger>
            <AddLinkModal selectedGroup={selectedGroup} />
          </Dialog.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="bg-white border border-slate-200 font-medium flex justify-center gap-1 
                items-center h-12 px-8 rounded-3xl text-slate-600 hover:bg-slate-50"
              >
                <FolderPlus className="w-4 h-4" />
                分组管理
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white rounded-lg p-2 shadow-lg border border-slate-100"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="text-slate-600 rounded px-2 py-2 text-sm cursor-pointer hover:bg-slate-50 outline-none"
                  onSelect={() => setSelectedGroup(null)}
                >
                  全部链接
                </DropdownMenu.Item>
                {groups?.map((group) => (
                  <DropdownMenu.Item
                    key={group.id}
                    className="text-slate-600 rounded px-2 py-2 text-sm cursor-pointer hover:bg-slate-50 outline-none"
                    onSelect={() => setSelectedGroup(group.id)}
                  >
                    {group.name}
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="h-px bg-slate-200 my-2" />
                <DropdownMenu.Item
                  className="text-blue-600 rounded px-2 py-2 text-sm cursor-pointer hover:bg-blue-50 outline-none"
                  onSelect={handleCreateGroup}
                >
                  创建新分组
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="my-10">
          {!isLoading ? (
            filteredLinks?.length > 0 ? (
              filteredLinks.map(({ id, ...userLink }) => (
                <React.Fragment key={id}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SortableContext
                      items={filteredLinks}
                      strategy={verticalListSortingStrategy}
                    >
                      <Link key={id} id={id} {...userLink} />
                    </SortableContext>
                  </motion.div>
                </React.Fragment>
              ))
            ) : (
              <div className="mt-4 w-[245px] h-auto flex flex-col mx-auto">
                <Image
                  className="object-cover"
                  width="220"
                  height="220"
                  alt="not-found"
                  src="/assets/not-found.png"
                />
                <h3 className="font-bold text-lg mt-3 text-[#222]">
                  {selectedGroup ? '该分组暂无链接' : '您还没有添加任何链接'}
                </h3>
                <p className="text-sm text-[#555] text-center px-3">
                  {selectedGroup ? '点击上方按钮添加链接到此分组' : '点击上方按钮添加您的第一个链接 🚀'}
                </p>
              </div>
            )
          ) : (
            Array.from({ length: 4 }).map((_, i) => <LinkSkeleton key={i} />)
          )}
        </div>
      </div>
      <div className="h-[40px] mb-12" />
    </DndContext>
  );
};

export default LinksEditor;
