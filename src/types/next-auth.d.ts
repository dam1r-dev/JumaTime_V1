import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    /** Bumped in src/lib/session-version.ts whenever session.user's shape changes. */
    version?: number;
    user: {
      id: string;
      mosqueId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    mosqueId?: string;
    v?: number;
  }
}
