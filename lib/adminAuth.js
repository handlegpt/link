import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { db } from './db';

const adminAuth = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    throw new Error('未登录');
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    throw new Error('未登录');
  }

  if (currentUser.role !== 'admin') {
    throw new Error('无权限访问');
  }

  return { currentUser };
};

export default adminAuth; 