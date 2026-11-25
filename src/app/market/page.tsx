import type { Metadata } from "next";
import { ListingCard } from "@/components/ListingCard";
import { Pagination } from "@/components/Pagination";
import { getMarketCatalog, listListings } from "@/lib/api";
import { fa } from "@/lib/format";

export const metadata: Metadata = { title: "بازار تجهیزات" };

interface Props {
  searchParams: Promise<{ q?: string; city?: string; category?: string; page?: string }>;
}

export default async function MarketPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const city = params.city?.trim() || undefined;
  const category = Number.parseInt(params.category ?? "", 10) || undefined;
  const page = Math.max(0, Number.parseInt(params.page ?? "0", 10) || 0);
  const [result, catalog] = await Promise.all([listListings(q, city, category, page), getMarketCatalog()]);

  return (
    <>
      <section className="hero">
        <h1>بازار تجهیزات</h1>
        <p>دوربین، لنز، نور و بقیه‌ی تجهیزات دست‌دوم و نو؛ از خود اعضا.</p>
        <form action="/market" role="search" className="search">
          <label htmlFor="q" className="visually-hidden">
            جستجو
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="عنوان، برند یا مدل" />
          <select name="category" aria-label="دسته" defaultValue={category ?? ""}>
            <option value="">همه‌ی دسته‌ها</option>
            {catalog.categories.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.icon} {entry.name}
              </option>
            ))}
          </select>
          <input name="city" type="search" aria-label="شهر" defaultValue={city} placeholder="شهر" />
          <button type="submit">جستجو</button>
        </form>
      </section>

      <p className="count" aria-live="polite">
        {result.totalItems === 0 ? "آگهی‌ای پیدا نشد." : `${fa(result.totalItems)} آگهی`}
      </p>
      <ul className="grid">
        {result.items.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ul>
      <Pagination
        basePath="/market"
        params={{ q, city, category: category ? String(category) : undefined }}
        page={result.page}
        totalPages={result.totalPages}
      />
    </>
  );
}
