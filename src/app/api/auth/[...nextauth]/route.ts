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

        try {
          await pool.query('SELECT aeromiles.verifikasi_login($1, $2)', [credentials.email, credentials.password]);

          const userQuery = `
            SELECT p.email, p.first_mid_name, p.last_name,
                   CASE WHEN EXISTS (SELECT 1 FROM aeromiles.MEMBER WHERE email = p.email) THEN 'member'
                        WHEN EXISTS (SELECT 1 FROM aeromiles.STAF WHERE email = p.email) THEN 'staf'
                   END AS role,
                   s.kode_maskapai
            FROM aeromiles.PENGGUNA p
            LEFT JOIN aeromiles.STAF s ON p.email = s.email
            WHERE LOWER(p.email) = LOWER($1);
          `;
          const result = await pool.query(userQuery, [credentials.email]);
          const user = result.rows[0];

          return {
            id: user.email,
            name: `${user.first_mid_name} ${user.last_name || ''}`.trim(),
            email: user.email,
            role: user.role,
            kode_maskapai: user.kode_maskapai
          };
        } catch (error: any) {
          console.error("Auth Exception:", error.message);
          throw new Error(error.message || "Email atau password salah, silakan coba lagi.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.kode_maskapai = (user as any).kode_maskapai;
      }
      // Tambahkan logic ini untuk menangkap update dari client-side
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.name = token.name as string; // Pastikan nama di session ikut terupdate dari token
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