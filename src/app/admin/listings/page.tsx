import Link from "next/link";
import { ListingHiddenToggle } from "@/components/ListingHiddenToggle";
import { Pagination } from "@/components/Pagination";
import { authedGet } from "@/lib/backend";
import { fa, toman } from "@/lib/format";
import type { AdminListing, PageResponse } from "@/lib/types";

export default async function AdminListingsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageText } = await searchParams;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const result = await authedGet<PageResponse<AdminListing>>(`/api/v1/admin/listings?page=${page}`);

  return (
    <>
      <section className="hero">
        <h1>آگهی‌های بازار</h1>
      </section>
      <p className="count">{result.totalItems === 0 ? "آگهی‌ای نیست." : `${fa(result.totalItems)} آگهی`}</p>
      <ul className="price-menu">
        {result.items.map((listing) => (
          <li key={listing.id} className="price-menu__row">
            <span className="price-menu__name">
              {listing.status.key === "ACTIVE" && !listing.hidden ? (
                <Link href={`/market/${listing.id}`}>{listing.title}</Link>
              ) : (
                listing.title
              )}
              {listing.hidden && " (مخفی)"}
            </span>
            <span className="price-menu__amount">
              {toman(listing.price)} · {listing.status.label}
              <span className="hint">
                {" "}
                فروشنده: {listing.sellerName ?? "—"} · {fa(listing.photoCount)} عکس
                {listing.pendingOffers > 0 && ` · ${fa(listing.pendingOffers)} پیشنهاد منتظر`}
              </span>
            </span>
            <span className="price-menu__actions">
              <ListingHiddenToggle id={listing.id} hidden={listing.hidden} />
            </span>
          </li>
        ))}
      </ul>
      <Pagination basePath="/admin/listings" params={{}} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
