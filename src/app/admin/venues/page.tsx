import Link from "next/link";
import { Pagination } from "@/components/Pagination";
import { VenueActiveToggle } from "@/components/VenueActiveToggle";
import { authedGet } from "@/lib/backend";
import { fa } from "@/lib/format";
import type { AdminVenue, PageResponse } from "@/lib/types";

export default async function AdminVenuesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageText } = await searchParams;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const result = await authedGet<PageResponse<AdminVenue>>(`/api/v1/admin/venues?page=${page}`);

  return (
    <>
      <section className="hero">
        <h1>مکان‌ها</h1>
      </section>
      <p className="count">{result.totalItems === 0 ? "مکانی نیست." : `${fa(result.totalItems)} مکان`}</p>
      <ul className="price-menu">
        {result.items.map((venue) => (
          <li key={venue.id} className="price-menu__row">
            <span className="price-menu__name">
              {venue.listed ? <Link href={`/venues/${venue.id}`}>{venue.name}</Link> : venue.name}
              {!venue.active && " (غیرفعال)"}
            </span>
            <span className="price-menu__amount">
              {[venue.type?.label, venue.city, venue.ownerName && `مالک: ${venue.ownerName}`].filter(Boolean).join(" · ")}
              <span className="hint">
                {" "}
                {venue.listed ? "توی فهرست" : "توی فهرست نیست"} · {fa(venue.priceCount)} قیمت · {fa(venue.photoCount)} عکس
                {venue.pendingRequests > 0 && ` · ${fa(venue.pendingRequests)} درخواست منتظر`}
              </span>
            </span>
            <span className="price-menu__actions">
              <VenueActiveToggle id={venue.id} active={venue.active} />
            </span>
          </li>
        ))}
      </ul>
      <Pagination basePath="/admin/venues" params={{}} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
