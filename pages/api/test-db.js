import { db } from '@/lib/db';

export default async function handler(req, res) {
  try {
    // 尝试执行一个简单的数据库查询
    const count = await db.user.count();
    return res.status(200).json({ message: '数据库连接成功', userCount: count });
  } catch (error) {
    console.error('数据库连接测试错误:', error);
    return res.status(500).json({ 
      message: '数据库连接失败', 
      error: error.message,
      code: error.code 
    });
  }
} 