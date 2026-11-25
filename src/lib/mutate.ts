import { revalidatePath } from "next/cache";
import { authed } from "./backend";
import type { MutationResult } from "./types";

export const FALLBACK = "مشکلی پیش اومد؛ چند لحظه‌ی دیگه دوباره امتحان کن.";

const COMMON: Record<string, string> = {
  UNAUTHORIZED: "ورودت منقضی شده؛ دوباره وارد شو.",
  NOT_FOUND: "این مورد پیدا نشد؛ شاید قبلاً پاک شده.",
  VENUE_NOT_FOUND: "این مکان پیدا نشد.",
  BOOKING_VENUE_NOT_AVAILABLE: "این مکان الان برای رزرو در دسترس نیست.",
  BOOKING_OWN_VENUE: "این مکان خودته؛ نمی‌تونی ازش درخواست رزرو بدی.",
  BOOKING_DAY_NOT_FREE: "این روز دیگه آزاد نیست؛ روز دیگه‌ای رو انتخاب کن.",
  BOOKING_ALREADY_REQUESTED: "همین درخواست رو قبلاً فرستادی و منتظر جواب مالکه.",
  BOOKING_INVALID_TIME: "ساعت شروع باید قبل از ساعت پایان باشه.",
  VENUE_LIMIT_REACHED: "به سقف تعداد مکان‌هات رسیدی.",
  VENUE_PRICE_LIMIT_REACHED: "قیمت‌های این مکان پر شده؛ اول یکی رو پاک کن.",
  FORBIDDEN: "این کار فقط برای ادمین‌هاست.",
  CANNOT_BLOCK_SELF: "نمی‌تونی حساب خودت رو مسدود کنی.",
  SERVICE_NAME_TAKEN: "خدمتی با این اسم هست.",
  LISTING_NOT_FOUND: "این آگهی پیدا نشد.",
  LISTING_LIMIT_REACHED: "به سقف آگهی‌های فعالت رسیدی؛ اول یکی رو ببند یا فروخته‌شده کن.",
  MARKET_LISTING_NOT_AVAILABLE: "این آگهی دیگه در دسترس نیست.",
  MARKET_OWN_LISTING: "این آگهی خودته؛ نمی‌تونی پیشنهاد بدی.",
  MARKET_ALREADY_OFFERED: "پیشنهاد قبلیت هنوز منتظر جواب فروشنده‌ست.",
  MARKET_INVALID_AMOUNT: "مبلغ پیشنهاد درست نیست.",
  OFFER_ALREADY_ANSWERED: "این پیشنهاد دیگه منتظر جواب نیست.",
  REQUEST_ALREADY_ANSWERED: "به این درخواست قبلاً جواب داده شده.",
};

/** Turns an error answer of the backend into a sentence for the member. */
export async function failure(response: Response): Promise<MutationResult> {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  const known = body?.error ? COMMON[body.error] : undefined;
  if (known) return { ok: false, message: known };
  if (response.status === 400) {
    return { ok: false, message: "مقدارهای واردشده درست نیست. طول متن‌ها، تاریخ و عددها رو بررسی کن." };
  }
  return { ok: false, message: FALLBACK };
}

/** A change as the signed-in member; the pages in {@code refresh} are fetched again afterwards. */
export async function send(
  method: "PUT" | "POST" | "DELETE",
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
