import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const MOSQUE_COOKIE = "mosque";

export async function getMosques() {
  return prisma.mosque.findMany({ orderBy: { order: "asc" } });
}

/** Resolves the visitor's selected mosque from the cookie, falling back to the first mosque. */
export async function getCurrentMosque(mosques: Awaited<ReturnType<typeof getMosques>>) {
  const store = await cookies();
  const selectedSlug = store.get(MOSQUE_COOKIE)?.value;
  return mosques.find((m) => m.slug === selectedSlug) ?? mosques[0] ?? null;
}
