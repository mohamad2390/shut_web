import Link from "next/link";
import type { RentalItemSummary, RentalSearchItem } from "@/lib/types";
import { fa, toman } from "@/lib/format";

type Item = RentalItemSummary | RentalSearchItem;

export function RentalItemCard({ item }: { item: Item }) {
  const shop = "shopName" in item ? item : null;
  return (
    <li className="card">
      <Link href={`/rental/items/${item.id}`} className="card__link">
        <h2 className="card__name">{item.title}</h2>
        <p className="card__city">
          {[item.typeIcon && `${item.typeIcon} ${item.typeName}`, shop && `${shop.shopName}، ${shop.shopCity}`]
            .filter(Boolean)
            .join(" · ") || item.typeName}
        </p>
        <p className="prices__amount">{toman(item.dailyPrice)} در روز</p>
        <p className="card__meta">{item.photoCount > 0 ? `${fa(item.photoCount)} عکس` : "بدون عکس"}</p>
      </Link>
    </li>
  );
}
