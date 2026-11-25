import type { Metadata } from "next";
import Link from "next/link";
import { ListingForm } from "@/components/ListingForm";
import { getMarketCatalog } from "@/lib/api";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { fa, toman } from "@/lib/format";
import type { MyListing } from "@/lib/types";

export const metadata: Metadata = { title: "آگهی‌های من" };

export default async function MyListingsPage() {
  await requireMe("/me/listings");
  const [listings, catalog] = await Promise.all([authedGet<MyListing[]>("/api/v1/me/listings"), getMarketCatalog()]);
  const active = listings.filter((listing) => listing.status.key === "ACTIVE").length;

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>آگهی‌های من</h1>
        <p>تجهیزاتی که می‌فروشی. عکس آگهی فقط از ربات تلگرام اضافه می‌شه.</p>
      </section>

      {listings.length === 0 ? (
        <p className="empty">هنوز آگهی‌ای نذاشتی.</p>
      ) : (
        <ul className="grid">
          {listings.map((listing) => (
            <li key={listing.id} className="card">
              <Link href={`/me/listings/${listing.id}`} className="card__link">
                <h2 className="card__name">{listing.title}</h2>
                <p className="card__city">
                  {toman(listing.price)} · {listing.status.label}
                  {listing.hidden && " · مخفی شده توسط ادمین"}
                </p>
                <p className="hint">
                  {listing.pendingOffers > 0 ? `${fa(listing.pendingOffers)} پیشنهاد منتظر جواب` : "پیشنهاد جدیدی نیست"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="form__title">آگهی جدید</h2>
      {active >= catalog.maxActiveListings ? (
        <p className="hint">به سقف {fa(catalog.maxActiveListings)} آگهی فعال رسیدی. یکی رو ببند یا فروخته‌شده کن.</p>
      ) : (
        <ListingForm catalog={catalog} />
      )}
    </>
  );
}
