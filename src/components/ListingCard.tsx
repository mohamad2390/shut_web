import Link from "next/link";
import { listingPhotoUrl } from "@/lib/api";
import { toman } from "@/lib/format";
import type { ListingListItem } from "@/lib/types";

export function ListingCard({ listing }: { listing: ListingListItem }) {
  return (
    <li className="card">
      <Link href={`/market/${listing.id}`} className="card__link">
        {listing.firstPhotoId !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="card__photo" src={listingPhotoUrl(listing.id, listing.firstPhotoId)} alt="" loading="lazy" />
        )}
        <h2 className="card__name">{listing.title}</h2>
        <p className="card__city">
          {[listing.category, listing.brand, listing.model, listing.city].filter(Boolean).join(" · ")}
        </p>
        <p className="card__meta">
          {toman(listing.price)} · {listing.condition.label}
          {listing.negotiable && " · قابل مذاکره"}
        </p>
      </Link>
    </li>
  );
}
