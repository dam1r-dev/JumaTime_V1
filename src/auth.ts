import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_VERSION } from "@/lib/session-version";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Short-lived on purpose: this is a shared admin device at the mosque, not a
  // personal one — a session left open shouldn't stay valid indefinitely.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, mosqueId: user.mosqueId };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mosqueId = (user as { mosqueId: string }).mosqueId;
        token.v = SESSION_VERSION;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.mosqueId = token.mosqueId as string;
      }
      session.version = token.v as number;
      return session;
    },
  },
});
