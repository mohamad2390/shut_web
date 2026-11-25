import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Me } from "./types";

/** The sign-in token lives in an httpOnly cookie, so scripts in the browser can never read it. */
export const SESSION_COOKIE = "shut_session";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export async function sessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** The signed-in member, or null when nobody is signed in or the sign-in has expired. */
export async function getMe(): Promise<Me | null> {
  const token = await sessionToken();
  if (!token) return null;
  const response = await fetch(new URL("/api/v1/me", API_URL), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`The server answered ${response.status}`);
  return (await response.json()) as Me;
}

/** Only paths of this site: stops «?next=https://evil.example» from sending people away after signing in. */
export function safeNext(next: string | undefined | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/** The signed-in member; anyone else is sent to the sign-in page and brought back to {@code next} afterwards. */
export async function requireMe(next: string): Promise<Me> {
  const me = await getMe();
  if (!me) redirect(`/login?next=${encodeURIComponent(next)}`);
  return me;
}
