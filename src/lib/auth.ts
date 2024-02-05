import { NextAuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { executeQuery } from './mysql';
import bcrypt from 'bcrypt';
import { User } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      credentials: {},
      async authorize(credentials): Promise<any> {
        const { username, password } = credentials as any;
        const [user] = (await executeQuery(
          'SELECT id, name, position, permision, active, image, password FROM users WHERE username = ?',
          [username]
        )) as User & any[];

        if (user && (await bcrypt.compare(password, user.password)))
          return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        // @ts-ignore
        token.permision = user.permision;
        // @ts-ignore
        token.active = user.active;
        token.image = user.image;
        // @ts-ignore
        token.position = user.position;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.name = token.name;
        // @ts-ignore
        session.user.permision = token.permision;
        // @ts-ignore
        session.user.active = token.active;
        // @ts-ignore
        session.user.image = token.image;
        // @ts-ignore
        session.user.position = token.position;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
};
