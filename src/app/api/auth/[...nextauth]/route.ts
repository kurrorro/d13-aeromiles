import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const query = `
          SELECT p.email, p.password, p.first_mid_name, p.last_name,
                 CASE WHEN EXISTS (SELECT 1 FROM MEMBER WHERE email = p.email) 
                      THEN 'member'
                      WHEN EXISTS (SELECT 1 FROM STAF WHERE email = p.email) 
                      THEN 'staf'
                 END AS role,
                 s.kode_maskapai
          FROM PENGGUNA p
          LEFT JOIN STAF s ON p.email = s.email
          WHERE LOWER(p.email) = LOWER($1);
        `;

        try {
          const result = await pool.query(query, [credentials.email]);
          
          if (result.rows.length === 0) return null;

          const user = result.rows[0];
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) return null;

          return {
            id: user.email,
            name: `${user.first_mid_name} ${user.last_name || ''}`.trim(),
            email: user.email,
            role: user.role,
            kode_maskapai: user.kode_maskapai
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.kode_maskapai = (user as any).kode_maskapai;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        (session.user as any).kode_maskapai = token.kode_maskapai as string;
      }
      return session;
    },
  },
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET || "rahasia-bebas-apa-aja",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };