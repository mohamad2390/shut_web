import { ProviderCard } from "@/components/ProviderCard";
import { Pagination } from "@/components/Pagination";
import { listProviders } from "@/lib/api";
import { fa } from "@/lib/format";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { q, page: pageText } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const result = await listProviders(query, page);

  return (
    <>
      <section className="hero">
        <h1>متخصص مناسب پروژه‌ات را پیدا کن</h1>
        <form action="/" role="search" className="search">
          <label htmlFor="q" className="visually-hidden">
            جستجو
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="نام، شهر یا مهارت؛ مثلاً «عکاس عروسی شیراز»"
          />
          <button type="submit">جستجو</button>
        </form>
      </section>

      <p className="count" aria-live="polite">
        {result.totalItems === 0 ? "نتیجه‌ای پیدا نشد." : `${fa(result.totalItems)} متخصص`}
      </p>

      {result.items.length === 0 && query && (
        <p className="empty">برای «{query}» متخصصی نیست. جستجو را کوتاه‌تر کن یا فقط نام شهر را بنویس.</p>
      )}

      <ul className="grid">
        {result.items.map((provider) => (
          <ProviderCard key={provider.userId} provider={provider} />
        ))}
      </ul>

      <Pagination basePath="/" params={{ q: query }} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
