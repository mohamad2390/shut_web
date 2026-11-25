"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, safeNext, sessionToken } from "@/lib/auth";
import type { LoginResult } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export type ActionResult = { ok: true } | { ok: false; message: string };

const MESSAGES: Record<string, string> = {
  INVALID_PHONE: "شماره‌ی موبایل درست نیست؛ مثلاً ۰۹۱۲۱۲۳۴۵۶۷",
  TOO_MANY_REQUESTS: "کمی صبر کن و دوباره کد بگیر.",
  INVALID_CODE: "کد اشتباهه یا منقضی شده. اگه لازم شد کد جدید بگیر.",
};
const FALLBACK = "مشکلی پیش اومد؛ چند لحظه‌ی دیگه دوباره امتحان کن.";

async function post(path: string, body?: unknown, token?: string): Promise<Response> {
  return fetch(new URL(path, API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

async function failure(response: Response): Promise<ActionResult> {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  return { ok: false, message: (body?.error && MESSAGES[body.error]) || FALLBACK };
}

/** Asks the backend to send a code to the phone. */
export async function requestCodeAction(phone: string): Promise<ActionResult> {
  try {
    const response = await post("/api/v1/auth/otp/request", { phone });
    return response.ok ? { ok: true } : await failure(response);
  } catch {
    return { ok: false, message: FALLBACK };
  }
}

/** Checks the code; on success keeps the token in a cookie and goes to the page the member came from. */
export async function verifyCodeAction(phone: string, code: string, next: string): Promise<ActionResult> {
  let login: LoginResult;
  try {
    const response = await post("/api/v1/auth/otp/verify", { phone, code });
    if (!response.ok) return await failure(response);
    login = (await response.json()) as LoginResult;
  } catch {
    return { ok: false, message: FALLBACK };
  }
  (await cookies()).set(SESSION_COOKIE, login.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(login.expiresAt),
  });
  redirect(safeNext(next));
}

export async function logoutAction(): Promise<void> {
  const token = await sessionToken();
  if (token) {
    await post("/api/v1/auth/logout", undefined, token).catch(() => undefined);
  }
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
