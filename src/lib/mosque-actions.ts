"use server";

import { cookies } from "next/headers";
import { MOSQUE_COOKIE } from "./mosque";

export async function setMosqueCookie(slug: string) {
  const store = await cookies();
  store.set(MOSQUE_COOKIE, slug, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
