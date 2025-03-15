import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: '不支持的请求方法' });
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { id } = req.query;

    if (req.method === 'GET') {
      const group = await db.linkGroup.findUnique({
        where: { id },
        include: {
          links: {
            where: {
              userId: currentUser.id
            }
          }
        }
      });

      if (!group) {
        return res.status(404).json({ message: '分组不存在' });
      }

      return res.status(200).json(group);
    }

    if (req.method === 'PATCH') {
      const { name, order } = req.body;

      if (!name) {
        return res.status(400).json({ message: '分组名称不能为空' });
      }

      const group = await db.linkGroup.update({
        where: { id },
        data: {
          name,
          order: order || undefined
        }
      });

      return res.status(200).json(group);
    }

    if (req.method === 'DELETE') {
      await db.linkGroup.delete({
        where: { id }
      });

      return res.status(204).end();
    }
  } catch (error) {
    console.error('分组API错误:', error);
    return res.status(500).json({ message: '服务器错误' });
  }
} 