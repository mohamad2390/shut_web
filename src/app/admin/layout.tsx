import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireMe } from "@/lib/auth";
import { isAdmin } from "@/lib/backend";

export const metadata: Metadata = { title: "پنل ادمین", robots: { index: false } };

/** Everything under /admin: anybody who is not an administrator sees a plain «not found». */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireMe("/admin");
  if (!(await isAdmin())) notFound();

  return (
    <>
      <nav className="tabs" aria-label="پنل ادمین">
        <Link href="/admin/users">کاربران</Link>
        <Link href="/admin/venues">مکان‌ها</Link>
        <Link href="/admin/listings">آگهی‌های بازار</Link>
        <Link href="/admin/services">خدمت‌ها و واحدها</Link>
      </nav>
      {children}
    </>
  );
}
