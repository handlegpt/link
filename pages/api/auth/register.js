import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '不支持的请求方法' });
  }

  try {
    const { email, password, name } = req.body;
    
    // 输入验证
    if (!email || !password || !name) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    // 数据清理
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // 邮箱格式验证
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: '邮箱格式不正确' });
    }

    // 密码强度验证
    if (!validatePassword(password)) {
      return res.status(400).json({ message: '密码长度至少为8位' });
    }

    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 12);
    const handle = nanoid(10); // 生成随机handle

    // 创建用户
    const user = await db.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        password: hashedPassword,
        handle,
        themePalette: {
          name: "Light",
          palette: ["#FFFFFF", "#F2F2F2", "#1F2937", "#6170F8"]
        },
        buttonStyle: "rounded-md"
      },
    });

    // 移除密码后返回用户信息
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ 
      message: '注册成功', 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json({ 
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 