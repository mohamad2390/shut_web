import Link from "next/link";
import type { Metadata } from "next";
import { Pagination } from "@/components/Pagination";
import { RentalItemCard } from "@/components/RentalItemCard";
import { listRentalShops, searchRentalItems } from "@/lib/api";
import { fa } from "@/lib/format";

export const metadata: Metadata = { title: "اجاره‌ی تجهیزات" };

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function RentalPage({ searchParams }: Props) {
  const { q: text, page: pageText } = await searchParams;
  const q = text?.trim() || undefined;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const query = q !== undefined && q.length >= 2 ? q : undefined;
  const searching = query !== undefined;
  const items = query !== undefined ? await searchRentalItems(query, page) : null;
  const shops = items === null ? await listRentalShops(page) : null;
  const result = items ?? shops!;

  return (
    <>
      <section className="hero">
        <h1>اجاره‌ی تجهیزات</h1>
        <p>دوربین، لنز و نور را از مغازه‌های اجاره پیدا کن؛ پرداخت و تحویل مستقیم با مغازه‌دار است.</p>
        <form action="/rental" role="search" className="search">
          <label htmlFor="q" className="visually-hidden">
            جستجو
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="نوع، برند یا مدل؛ مثلاً «سونی»" />
          <button type="submit">جستجو</button>
        </form>
      </section>

      <p className="count" aria-live="polite">
        {result.totalItems === 0
          ? searching
            ? "موردی پیدا نشد."
            : "هنوز مغازه‌ای ثبت نشده."
          : `${fa(result.totalItems)} ${searching ? "مورد" : "مغازه"}`}
      </p>

      {items && (
        <ul className="grid">
          {items.items.map((item) => (
            <RentalItemCard key={item.id} item={item} />
          ))}
        </ul>
      )}
      {shops && (
        <ul className="grid">
          {shops.items.map((shop) => (
            <li key={shop.id} className="card">
              <Link href={`/rental/shops/${shop.id}`} className="card__link">
                <h2 className="card__name">{shop.name}</h2>
                <p className="card__city">{shop.city}</p>
                <p className="card__meta">{fa(shop.itemCount)} مورد موجود</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination basePath="/rental" params={{ q }} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
