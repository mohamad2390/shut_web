import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getMe, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "ورود" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getMe()) redirect(next);

  return (
    <section className="hero">
      <h1>ورود</h1>
      <p>برای رزرو و استفاده از خدمات، با شماره‌ی موبایلت وارد شو. اگه توی ربات تلگرام هم حساب داری و شمارت رو اونجا ثبت کردی، همون حساب باز می‌شه.</p>
      <LoginForm next={next} />
    </section>
  );
}
