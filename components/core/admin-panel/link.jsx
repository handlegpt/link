import { GripVertical, BarChart, Copy, Folder } from 'lucide-react';
import PopoverDesktop from '../../shared/popovers/popover-desktop';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getApexDomain, timeAgo } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArchiveSVG } from '@/components/utils/archive-svg';
import TooltipWrapper from '@/components/utils/tooltip';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const LinkCard = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const apexDomain = getApexDomain(props.url);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(props.url);
    toast.success('链接已复制到剪贴板！');
  };

  // 获取分组信息
  const { data: group } = useQuery({
    queryKey: ['linkGroup', props.groupId],
    queryFn: async () => {
      if (!props.groupId) return null;
      const response = await axios.get(`/api/link-groups/${props.groupId}`);
      return response.data;
    },
    enabled: !!props.groupId
  });

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex items-center space-x-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300"
      >
        <button
          className="cursor-move text-gray-400 hover:text-gray-500"
          {...attributes}
          {...listeners}
        >
          <span className="sr-only">拖动重新排序</span>
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Image
                src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
                alt={apexDomain}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{props.title}</p>
                  {group && (
                    <TooltipWrapper content="所属分组">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Folder className="h-4 w-4" />
                        <span>{group.name}</span>
                      </div>
                    </TooltipWrapper>
                  )}
                </div>
                <div className="">
                  <div className="row-start-1 col-start-1 inline-flex">
                    <a
                      target="_blank"
                      href={props.url}
                      className="flex items-center max-w-full rounded-[2px] outline-offset-2 outline-2"
                    >
                      <p className="text-gray-500 w-[200px] text-sm lg:w-[320px] whitespace-nowrap overflow-hidden font-semibold text-ellipsis">
                        {props.url}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex justify-center items-center ">
              <div className="flex items-center">
                <small className="mr-8 hidden whitespace-nowrap text-sm text-gray-500 sm:block">
                  添加于 {timeAgo(props.createdAt, true)}
                </small>
                <PopoverDesktop {...props} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkCard;
