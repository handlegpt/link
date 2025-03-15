import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useCurrentUser = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/current');
        return response.data;
      } catch (error) {
        console.error('获取用户数据失败:', error);
        throw new Error(error.response?.data?.message || '获取用户数据失败');
      }
    },
    staleTime: 1000 * 60 * 5, // 5分钟内数据保持新鲜
    cacheTime: 1000 * 60 * 30, // 30分钟的缓存时间
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

export default useCurrentUser;
