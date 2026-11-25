const numbers = new Intl.NumberFormat("fa-IR");
const decimals = new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Persian digits: ۱۲۳٬۰۰۰ */
export function fa(value: number): string {
  return numbers.format(value);
}

export function ratingText(average: number, count: number): string {
  return count === 0 ? "بدون نظر" : `${decimals.format(average)} از ۵ · ${fa(count)} نظر`;
}

/** Only web addresses are linked; anything else (javascript:, data:) is dropped. */
export function safeWebUrl(url: string | null): string | null {
  if (!url) return null;
  const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const parsed = new URL(withScheme);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/** Prices are in toman: ۳٬۰۰۰٬۰۰۰ تومان */
export function toman(amount: number): string {
  return `${fa(amount)} تومان`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const jalaliDay = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "short",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** Today in Iran, as an ISO date (the bot and the calendar count days there). */
export function todayInIran(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(new Date());
}

/** The ISO date {@code days} after another one. */
export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/** A day in the Persian calendar: «ش ۱۰ آذر». */
export function jalali(iso: string): string {
  return jalaliDay.format(new Date(`${iso}T12:00:00Z`));
}

/** Digits only, for a tel: link. */
export function phoneDigits(phone: string | null): string | null {
  const digits = phone?.replace(/[^\d+]/g, "") ?? "";
  return digits.length >= 7 ? digits : null;
}

/** Latin digits to Persian ones: 0912 → ۰۹۱۲ */
export function faDigits(text: string): string {
  return text.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

/** A phone number with the middle hidden: ۰۹۱۲ ••• ۴۵۶۷ */
export function maskPhone(phone: string): string {
  return phone.length < 8 ? faDigits(phone) : faDigits(`${phone.slice(0, 4)} ••• ${phone.slice(-4)}`);
}

/**
 * A price typed by a member: Persian or Latin digits, with or without thousands separators.
 * Returns null when it is not a whole number above zero.
 */
export function parseAmount(text: string): number | null {
  const ascii = text.replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
  const cleaned = ascii.replace(/[,٬،\s]/g, "");
  if (!/^\d{1,11}$/.test(cleaned)) return null;
  const amount = Number(cleaned);
  return amount > 0 ? amount : null;
}
