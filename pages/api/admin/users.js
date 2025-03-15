import { db } from '@/lib/db';
import adminAuth from '@/lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return res.status(405).json({ message: '不支持的请求方法' });
  }

  try {
    await adminAuth(req, res);

    if (req.method === 'GET') {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          handle: true,
          role: true,
          createdAt: true,
          totalViews: true,
          _count: {
            select: {
              links: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json(users);
    }

    if (req.method === 'PATCH') {
      const { userId, action } = req.body;

      if (!userId || !action) {
        return res.status(400).json({ message: '参数错误' });
      }

      if (action === 'promote') {
        await db.user.update({
          where: { id: userId },
          data: { role: 'admin' }
        });
      } else if (action === 'demote') {
        await db.user.update({
          where: { id: userId },
          data: { role: 'user' }
        });
      } else if (action === 'delete') {
        await db.user.delete({
          where: { id: userId }
        });
      }

      return res.status(200).json({ message: '操作成功' });
    }
  } catch (error) {
    console.error('管理员API错误:', error);
    return res.status(error.message === '无权限访问' ? 403 : 500).json({ 
      message: error.message || '服务器错误' 
    });
  }
} 