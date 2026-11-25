import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarEditor } from "@/components/CalendarEditor";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { addDays, todayInIran } from "@/lib/format";
import type { CalendarDay, MyProfile } from "@/lib/types";

export const metadata: Metadata = { title: "تقویم من" };

/** How many days ahead to show. The backend allows up to 93 per request. */
const DAYS = 62;

export default async function MyCalendarPage() {
  await requireMe("/me/calendar");
  const profile = await authedGet<MyProfile>("/api/v1/me/profile");
  if (!profile.registered) redirect("/me/profile");

  const from = todayInIran();
  const marked = await authedGet<CalendarDay[]>(
    `/api/v1/me/calendar?from=${from}&to=${addDays(from, DAYS - 1)}`,
  );

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>تقویم من</h1>
        <p>
          روی هر روز بزن تا عوض بشه: نامشخص ← آزاد ← پر. دیگران همین تقویم رو توی پروفایلت و توی ربات می‌بینن.
        </p>
      </section>
      <CalendarEditor from={from} days={DAYS} marked={marked} />
    </>
  );
}
