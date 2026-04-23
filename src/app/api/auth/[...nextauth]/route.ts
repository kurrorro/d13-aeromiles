import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Cek di tabel PENGGUNA
        const user = await pool.query(
          'SELECT * FROM pengguna WHERE email = $1',
          [credentials.email]
        );
        if (user.rows.length === 0) return null;

        const valid = await bcrypt.compare(credentials.password, user.rows[0].password);
        if (!valid) return null;

        // Cek role: member atau staf?
        const member = await pool.query(
          'SELECT * FROM member WHERE email = $1', [credentials.email]
        );
        const staf = await pool.query(
          'SELECT * FROM staf WHERE email = $1', [credentials.email]
        );

        const role = member.rows.length > 0 ? 'member' : 
                     staf.rows.length > 0 ? 'staf' : null;

        if (!role) return null;

        return {
          id: credentials.email,
          email: credentials.email,
          name: `${user.rows[0].first_mid_name} ${user.rows[0].last_name}`,
          role: role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };