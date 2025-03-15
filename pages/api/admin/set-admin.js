import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '不支持的请求方法' });
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    // 更新用户角色为管理员
    await db.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        role: 'admin'
      }
    });

    return res.status(200).json({ message: '已成功设置为管理员' });
  } catch (error) {
    console.error('设置管理员失败:', error);
    return res.status(500).json({ message: '设置失败' });
  }
} 