import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import NextAuth from 'next-auth/next';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    newUser: '/onboarding',
    signIn: '/login',
    error: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('邮箱或密码错误');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('邮箱或密码错误');
        }

        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.handle = token.handle;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      if (!dbUser.handle) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            handle: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        handle: dbUser.handle,
        role: dbUser.role,
        buttonStyle: dbUser.buttonStyle,
        themePalette: dbUser.themePalette,
      };
    },

    redirect() {
      return '/admin';
    },
  },
};

export default NextAuth(authOptions);
