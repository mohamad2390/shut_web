import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PricingEditor } from "@/components/PricingEditor";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import type { MyProfile, PriceItem, PricingCatalog } from "@/lib/types";

export const metadata: Metadata = { title: "تعرفه‌های من" };

export default async function MyPricingPage() {
  await requireMe("/me/pricing");
  const profile = await authedGet<MyProfile>("/api/v1/me/profile");
  if (!profile.registered) redirect("/me/profile");

  const [items, catalog] = await Promise.all([
    authedGet<PriceItem[]>("/api/v1/me/prices"),
    authedGet<PricingCatalog>("/api/v1/pricing/catalog"),
  ]);

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>تعرفه‌های من</h1>
        <p>قیمت‌ها به تومان است. همین تعرفه توی ربات هم دیده می‌شه.</p>
      </section>
      <PricingEditor items={items} catalog={catalog} />
    </>
  );
}
