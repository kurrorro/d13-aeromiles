import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DUMMY_PENGGUNA } from "@/dummy/pengguna";
import { DUMMY_STAF } from "@/dummy/staf";

interface AuthUser extends User {
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = DUMMY_PENGGUNA.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        );

        if (user) {
          const isStaf = DUMMY_STAF.some((s) => s.email === user.email);
          return {
            id: user.email,
            name: `${user.first_mid_name} ${user.last_name}`,
            email: user.email,
            role: isStaf ? "staf" : "member",
          } as AuthUser;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET || "rahasia-bebas-apa-aja",
};
