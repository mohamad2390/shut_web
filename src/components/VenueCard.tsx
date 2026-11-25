import Link from "next/link";
import type { VenueListItem } from "@/lib/types";
import { fa } from "@/lib/format";
import { PriceList } from "./PriceList";

export function VenueCard({ venue }: { venue: VenueListItem }) {
  return (
    <li className="card">
      <Link href={`/venues/${venue.id}`} className="card__link">
        <h2 className="card__name">{venue.name}</h2>
        <p className="card__city">{[venue.type?.label, venue.city].filter(Boolean).join(" · ")}</p>
        <PriceList prices={venue.prices} />
        <p className="card__meta">{venue.photoCount > 0 ? `${fa(venue.photoCount)} عکس` : "بدون عکس"}</p>
      </Link>
    </li>
  );
}
