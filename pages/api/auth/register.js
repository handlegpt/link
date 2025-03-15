import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;
    
    console.log('Registration attempt:', { email, name }); // 添加日志

    if (!email || !password || !name) {
      console.log('Missing fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 12);
    const handle = nanoid(10); // 生成随机handle

    console.log('Creating user with handle:', handle);

    // 创建用户
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        handle,
        themePalette: {
          name: "Light",
          palette: ["#FFFFFF", "#F2F2F2", "#1F2937", "#6170F8"]
        },
        buttonStyle: "rounded-md"
      },
    });

    console.log('User created successfully:', user.id);

    return res.status(200).json({ message: '注册成功', user });
  } catch (error) {
    console.error('Registration error:', error);
    // 返回更详细的错误信息
    return res.status(500).json({ 
      message: '服务器错误', 
      error: error.message,
      code: error.code 
    });
  }
} 