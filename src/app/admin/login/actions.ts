"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { getBlockedMs } from "@/lib/login-rate-limit";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");

  if (typeof email === "string" && email.trim()) {
    const blockedMs = getBlockedMs(email);
    if (blockedMs > 0) {
      const minutes = Math.ceil(blockedMs / 60_000);
      return {
        error: `Слишком много неудачных попыток входа. Попробуйте снова через ${minutes} мин.`,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Неверный email или пароль" };
    }
    throw error;
  }
}
