import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '不支持的请求方法' });
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ error: '无效的链接数据' });
    }

    // 批量更新链接顺序
    const updatePromises = links.map(({ id, order }) =>
      db.link.update({
        where: {
          id: id,
          userId: currentUser.id // 确保只能更新自己的链接
        },
        data: { order }
      })
    );

    await Promise.all(updatePromises);

    return res.status(200).json({ message: '链接顺序已更新' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '服务器错误' });
  }
} 