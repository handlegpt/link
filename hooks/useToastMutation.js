import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useToastMutation = (mutationFn, options = {}) => {
  const {
    loadingMessage = '处理中...',
    successMessage = '操作成功',
    errorMessage = '操作失败',
    ...mutationOptions
  } = options;

  return useMutation(
    async (...args) => {
      toast.loading(loadingMessage);
      return await mutationFn(...args);
    },
    {
      ...mutationOptions,
      onSuccess: async (...args) => {
        toast.dismiss();
        toast.success(successMessage);
        await mutationOptions.onSuccess?.(...args);
      },
      onError: (error, ...args) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || errorMessage);
        console.error('Mutation error:', error);
        mutationOptions.onError?.(error, ...args);
      },
    }
  );
};

export default useToastMutation; 