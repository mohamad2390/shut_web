import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingForm } from "@/components/ListingForm";
import { ListingOffers } from "@/components/ListingOffers";
import { ListingStatusControls } from "@/components/ListingStatusControls";
import { ApiError, getMarketCatalog } from "@/lib/api";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { fa } from "@/lib/format";
import type { MyListing, SellerOffer } from "@/lib/types";

export const metadata: Metadata = { title: "مدیریت آگهی" };

export default async function MyListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idText } = await params;
  const id = Number(idText);
  if (!Number.isInteger(id) || id <= 0) notFound();
  await requireMe(`/me/listings/${id}`);

  let listing: MyListing;
  let offers: SellerOffer[];
  try {
    [listing, offers] = await Promise.all([
      authedGet<MyListing>(`/api/v1/me/listings/${id}`),
      authedGet<SellerOffer[]>(`/api/v1/me/listings/${id}/offers`),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  const catalog = await getMarketCatalog();

  return (
    <>
      <p className="back">
        <Link href="/me/listings">← آگهی‌های من</Link>
      </p>
      <section className="hero">
        <h1>{listing.title}</h1>
        <p>
          {listing.status.label}
          {listing.status.key === "ACTIVE" && !listing.hidden && (
            <>
              {" · "}
              <Link href={`/market/${listing.id}`}>دیدن صفحه‌ی عمومی</Link>
            </>
          )}
        </p>
        {listing.hidden && <p className="notice">این آگهی توسط ادمین از بازار مخفی شده.</p>}
        <ListingStatusControls id={listing.id} status={listing.status.key} />
      </section>

      <section>
        <h2>پیشنهادهای منتظر جواب</h2>
        <p className="hint">قبول کردن پیشنهاد آگهی رو نمی‌بنده؛ وقتی فروختی «فروخته شد» رو بزن.</p>
        <ListingOffers listingId={id} offers={offers} />
      </section>

      <section>
        <h2>اطلاعات آگهی</h2>
        <ListingForm catalog={catalog} listing={listing} />
      </section>

      <section>
        <h2>عکس‌ها</h2>
        <p className="hint">
          {listing.photoCount > 0 ? `${fa(listing.photoCount)} عکس داری. ` : "هنوز عکسی نداری. "}
          عکس آگهی فقط از ربات تلگرام اضافه یا پاک می‌شه.
        </p>
        {listing.botUrl && (
          <a className="button" href={listing.botUrl} rel="noopener noreferrer">
            مدیریت عکس‌ها در ربات
          </a>
        )}
      </section>
    </>
  );
}
