import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: '不支持的请求方法' });
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    if (req.method === 'GET') {
      const groups = await db.linkGroup.findMany({
        where: {
          links: {
            some: {
              userId: currentUser.id
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      });

      return res.status(200).json(groups);
    }

    if (req.method === 'POST') {
      const { name, order } = req.body;

      if (!name) {
        return res.status(400).json({ message: '分组名称不能为空' });
      }

      const group = await db.linkGroup.create({
        data: {
          name,
          order: order || 0
        }
      });

      return res.status(201).json(group);
    }
  } catch (error) {
    console.error('分组API错误:', error);
    return res.status(500).json({ message: '服务器错误' });
  }
} 