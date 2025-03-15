import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        handle: nanoid(10), // 生成随机handle
      },
    });

    return res.status(200).json({ message: '注册成功', user });
  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json({ message: '服务器错误' });
  }
} 