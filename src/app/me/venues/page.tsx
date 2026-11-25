import type { Metadata } from "next";
import Link from "next/link";
import { NewVenueForm } from "@/components/NewVenueForm";
import { getVenueCatalog } from "@/lib/api";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { fa } from "@/lib/format";
import type { MyVenueSummary } from "@/lib/types";

export const metadata: Metadata = { title: "مکان‌های من" };

export default async function MyVenuesPage() {
  await requireMe("/me/venues");
  const [venues, catalog] = await Promise.all([authedGet<MyVenueSummary[]>("/api/v1/me/venues"), getVenueCatalog()]);
  const full = venues.length >= catalog.maxVenuesPerOwner;

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>مکان‌های من</h1>
        <p>استودیو یا مکان عکاسی‌ات رو اینجا مدیریت کن؛ همین مکان‌ها توی ربات هم هستن.</p>
      </section>

      {venues.length === 0 ? (
        <p className="empty">هنوز مکانی نساختی.</p>
      ) : (
        <ul className="grid">
          {venues.map((venue) => (
            <li key={venue.id} className="card">
              <Link href={`/me/venues/${venue.id}`} className="card__link">
                <h2 className="card__name">{venue.name}</h2>
                <p className="card__city">{[venue.type?.label, venue.city].filter(Boolean).join(" · ") || "اطلاعات ناقص"}</p>
                <p className="hint">
                  {venue.listed ? "توی فهرست عمومی دیده می‌شه" : "توی فهرست عمومی نیست"}
                  {venue.pendingRequests > 0 && ` · ${fa(venue.pendingRequests)} درخواست منتظر جواب`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="form__title">مکان جدید</h2>
      {full ? (
        <p className="hint">به سقف {fa(catalog.maxVenuesPerOwner)} مکان رسیدی.</p>
      ) : (
        <NewVenueForm />
      )}
    </>
  );
}
