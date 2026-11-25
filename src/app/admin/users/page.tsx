import { AdminUserRow } from "@/components/AdminUserRow";
import { Pagination } from "@/components/Pagination";
import { authedGet } from "@/lib/backend";
import { fa } from "@/lib/format";
import type { AdminUser, PageResponse } from "@/lib/types";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page: pageText } = await searchParams;
  const query = q?.trim() || undefined;
  const page = Math.max(0, Number.parseInt(pageText ?? "0", 10) || 0);
  const params = new URLSearchParams({ page: String(page) });
  if (query) params.set("q", query);
  const result = await authedGet<PageResponse<AdminUser>>(`/api/v1/admin/users?${params}`);

  return (
    <>
      <section className="hero">
        <h1>کاربران</h1>
        <form action="/admin/users" role="search" className="search">
          <label htmlFor="q" className="visually-hidden">
            جستجو
          </label>
          <input id="q" name="q" type="search" defaultValue={query} placeholder="نام، شماره یا نام کاربری تلگرام" />
          <button type="submit">جستجو</button>
        </form>
      </section>

      <p className="count" aria-live="polite">
        {result.totalItems === 0 ? "کاربری پیدا نشد." : `${fa(result.totalItems)} حساب`}
      </p>
      <ul className="price-menu">
        {result.items.map((user) => (
          <AdminUserRow key={user.id} user={user} />
        ))}
      </ul>
      <Pagination basePath="/admin/users" params={{ q: query }} page={result.page} totalPages={result.totalPages} />
      <p className="hint">حساب مسدود نمی‌تونه وارد وب بشه و توی فهرست متخصص‌ها نیست. ربات این وضعیت رو بررسی نمی‌کنه.</p>
    </>
  );
}
