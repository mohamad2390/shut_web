import Link from "next/link";
import { fa } from "@/lib/format";

interface Props {
  basePath: string;
  /** The other query parameters to keep, e.g. the search text. */
  params: Record<string, string | undefined>;
  /** Counts from 0, like the API. */
  page: number;
  totalPages: number;
}

function href(basePath: string, params: Props["params"], page: number): string {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value) query.set(name, value);
  }
  if (page > 0) query.set("page", String(page));
  const text = query.toString();
  return text ? `${basePath}?${text}` : basePath;
}

export function Pagination({ basePath, params, page, totalPages }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      {page > 0 ? (
        <Link href={href(basePath, params, page - 1)} rel="prev">
          قبلی
        </Link>
      ) : (
        <span aria-disabled="true">قبلی</span>
      )}
      <span className="pagination__now">
        صفحه‌ی {fa(page + 1)} از {fa(totalPages)}
      </span>
      {page + 1 < totalPages ? (
        <Link href={href(basePath, params, page + 1)} rel="next">
          بعدی
        </Link>
      ) : (
        <span aria-disabled="true">بعدی</span>
      )}
    </nav>
  );
}
