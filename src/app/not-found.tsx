import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <h1>این صفحه پیدا نشد</h1>
      <p>ممکنه متخصص حذف شده باشه یا لینک اشتباه باشه.</p>
      <p>
        <Link href="/">برگشت به فهرست متخصص‌ها</Link>
      </p>
    </section>
  );
}
