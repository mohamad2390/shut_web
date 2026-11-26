import Link from "next/link";
import type { StudioListItem } from "@/lib/types";
import { fa } from "@/lib/format";

export function StudioCard({ studio }: { studio: StudioListItem }) {
  return (
    <li className="card">
      <Link href={`/studios/${studio.id}`} className="card__link">
        <h2 className="card__name">{studio.name}</h2>
        <p className="card__city">{studio.city}</p>
        <p className="card__meta">
          {fa(studio.offeringCount)} پکیج
          {studio.mediaCount > 0 ? ` · ${fa(studio.mediaCount)} نمونه‌کار` : ""}
        </p>
      </Link>
    </li>
  );
}
