"use server";

import { revalidatePath } from "next/cache";
import { authed } from "@/lib/backend";
import { parseAmount } from "@/lib/format";
import type { CalendarStatus, MutationResult } from "@/lib/types";

const FALLBACK = "مشکلی پیش اومد؛ چند لحظه‌ی دیگه دوباره امتحان کن.";

const MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "ورودت منقضی شده؛ دوباره وارد شو.",
  FORBIDDEN: "اول پروفایل متخصصی‌ات رو بساز.",
  PRICE_LIMIT_REACHED: "تعرفه‌ات پر شده؛ اول یکی از قیمت‌ها رو پاک کن.",
  NOT_FOUND: "این مورد پیدا نشد؛ شاید قبلاً پاک شده.",
};

/** Turns an error answer of the backend into a sentence for the member. */
async function failure(response: Response): Promise<MutationResult> {
  const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
  const known = body?.error ? MESSAGES[body.error] : undefined;
  if (known) return { ok: false, message: known };
  if (response.status === 400) {
    return { ok: false, message: "مقدارهای واردشده درست نیست. طول متن‌ها و اعداد رو بررسی کن." };
  }
  return { ok: false, message: FALLBACK };
}

async function send(
  method: "PUT" | "POST" | "PATCH" | "DELETE",
  path: string,
  body: unknown,
  refresh: string[],
): Promise<MutationResult> {
  try {
    const response = await authed(method, path, body);
    if (!response.ok) return await failure(response);
  } catch {
    return { ok: false, message: FALLBACK };
  }
  for (const page of refresh) revalidatePath(page);
  return { ok: true };
}

// ---- profile ----

export type ProfileFormState = { status: "idle" } | { status: "saved" } | { status: "error"; message: string };

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** One item per line or per comma: «عروسی، پرتره» */
function list(data: FormData, name: string): string[] {
  const items = text(data, name)
    .split(/[\n,،]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(items)];
}

export async function saveProfileAction(_previous: ProfileFormState, data: FormData): Promise<ProfileFormState> {
  const displayName = text(data, "displayName");
  if (!displayName) return { status: "error", message: "نام نمایشی لازم است." };

  const years = text(data, "yearsExperience");
  let website = text(data, "websiteUrl");
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;

  const result = await send(
    "PUT",
    "/api/v1/me/profile",
    {
      displayName,
      headline: text(data, "headline"),
      bio: text(data, "bio"),
      // A missing number leaves the saved one as it is; the backend cannot clear it.
      yearsExperience: years === "" ? null : Number(years),
      baseCity: text(data, "baseCity"),
      baseCountry: text(data, "baseCountry"),
      websiteUrl: website,
      instagramUsername: text(data, "instagramUsername").replace(/^@/, ""),
      equipmentDescription: text(data, "equipmentDescription"),
      skills: list(data, "skills"),
      serviceCities: list(data, "serviceCities"),
      collaborators: list(data, "collaborators"),
    },
    ["/me", "/me/profile", "/me/calendar", "/me/pricing"],
  );
  return result.ok ? { status: "saved" } : { status: "error", message: result.message };
}

// ---- calendar ----

/** @param status null clears the day */
export async function markDayAction(date: string, status: CalendarStatus | null): Promise<MutationResult> {
  return send("PUT", `/api/v1/me/calendar/${encodeURIComponent(date)}`, { status }, []);
}

// ---- prices ----

export interface NewPrice {
  serviceId: number;
  title: string;
  unit: string;
  amount: string;
}

export async function addPriceAction(price: NewPrice): Promise<MutationResult> {
  const amount = parseAmount(price.amount);
  if (amount === null) return { ok: false, message: "قیمت رو فقط با عدد و به تومان بنویس؛ مثلاً ۵۰۰۰۰۰." };
  return send(
    "POST",
    "/api/v1/me/prices",
    { serviceId: price.serviceId, title: price.title.trim() || null, unit: price.unit, amount },
    ["/me/pricing"],
  );
}

export async function updatePriceAction(id: number, unit: string, amountText: string): Promise<MutationResult> {
  const amount = parseAmount(amountText);
  if (amount === null) return { ok: false, message: "قیمت رو فقط با عدد و به تومان بنویس؛ مثلاً ۵۰۰۰۰۰." };
  return send("PATCH", `/api/v1/me/prices/${id}`, { unit, amount }, ["/me/pricing"]);
}

export async function deletePriceAction(id: number): Promise<MutationResult> {
  return send("DELETE", `/api/v1/me/prices/${id}`, undefined, ["/me/pricing"]);
}
