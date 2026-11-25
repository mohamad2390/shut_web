import Link from "next/link";
import type { ProviderListItem } from "@/lib/types";
import { Rating } from "./Rating";

export function ProviderCard({ provider }: { provider: ProviderListItem }) {
  return (
    <li className="card">
      <Link href={`/providers/${provider.userId}`} className="card__link">
        <h2 className="card__name">{provider.displayName}</h2>
        <p className="card__city">{provider.city ?? "شهر نامشخص"}</p>
        {provider.skills.length > 0 && (
          <ul className="chips" aria-label="مهارت‌ها">
            {provider.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}
        <Rating value={provider.rating} />
      </Link>
    </li>
  );
}
