import type { Metadata } from "next";
import { Pagination } from "@/components/Pagination";
import { VenueCard } from "@/components/VenueCard";
import { listVenues } from "@/lib/api";
import { fa } from "@/lib/format";

export const metadata: Metadata = { title: "مکان‌های عکاسی" };

export default async function VenuesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageText } = await searchParams;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const result = await listVenues(page);

  return (
    <>
      <section className="hero">
        <h1>مکان‌های عکاسی</h1>
        <p>عمارت، باغ، ویلا و استودیوی اجاره‌ای؛ با قیمت ساعتی، روزی و بسته‌ای.</p>
      </section>

      <p className="count">{result.totalItems === 0 ? "هنوز مکانی ثبت نشده." : `${fa(result.totalItems)} مکان`}</p>

      <ul className="grid">
        {result.items.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </ul>

      <Pagination basePath="/venues" params={{}} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
