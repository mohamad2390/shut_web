import type { Metadata } from "next";
import Link from "next/link";
import { MyOffersList } from "@/components/MyOffersList";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import type { MyOffer } from "@/lib/types";

export const metadata: Metadata = { title: "پیشنهادهای من" };

export default async function MyOffersPage() {
  await requireMe("/me/offers");
  const offers = await authedGet<MyOffer[]>("/api/v1/me/offers");
  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>پیشنهادهای من</h1>
        <p>۲۰ پیشنهاد آخرت. وقتی فروشنده قبول کنه، راه ارتباطش همین‌جا نشون داده می‌شه؛ پرداخت و تحویل بین خودتونه.</p>
      </section>
      <MyOffersList offers={offers} />
    </>
  );
}
