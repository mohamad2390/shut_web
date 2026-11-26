import type { Metadata } from "next";
import { Pagination } from "@/components/Pagination";
import { StudioCard } from "@/components/StudioCard";
import { listStudios } from "@/lib/api";
import { fa } from "@/lib/format";

export const metadata: Metadata = { title: "استودیوها" };

export default async function StudiosPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageText } = await searchParams;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const result = await listStudios(page);

  return (
    <>
      <section className="hero">
        <h1>استودیوها</h1>
        <p>استودیوهای عکاسی و فیلمبرداری با پکیج‌ها، نمونه‌کارها و افراد تیم.</p>
      </section>

      <p className="count">{result.totalItems === 0 ? "هنوز استودیویی ثبت نشده." : `${fa(result.totalItems)} استودیو`}</p>

      <ul className="grid">
        {result.items.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </ul>

      <Pagination basePath="/studios" params={{}} page={result.page} totalPages={result.totalPages} />
    </>
  );
}
