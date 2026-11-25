import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { sessionToken } from "./auth";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** A request to the backend as the signed-in member. Runs on the server only; the token never reaches the browser. */
export async function authed(method: Method, path: string, body?: unknown): Promise<Response> {
  const token = await sessionToken();
  return fetch(new URL(path, API_URL), {
    method,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

/** GET as the signed-in member. An expired sign-in sends them to the sign-in page. */
export async function authedGet<T>(path: string): Promise<T> {
  const response = await authed("GET", path);
  if (response.status === 401) redirect("/login");
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    throw new ApiError(response.status, body?.error ?? null, body?.message ?? response.statusText);
  }
  return (await response.json()) as T;
}

/** Whether the signed-in member is an administrator (the backend answers 204, or 403 for anybody else). */
export async function isAdmin(): Promise<boolean> {
  try {
    const response = await authed("GET", "/api/v1/admin/me");
    return response.status === 204;
  } catch {
    return false;
  }
}
