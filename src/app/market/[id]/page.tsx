import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferForm } from "@/components/OfferForm";
import { getListing, listingPhotoUrl } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { toman } from "@/lib/format";

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const listing = await getListing(parseId((await params).id));
  return listing ? { title: listing.title, description: listing.description ?? undefined } : {};
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const listing = await getListing(id);
  if (!listing) notFound();
  const me = await getMe();

  return (
    <article className="profile">
      <p className="back">
        <Link href="/market">← بازار تجهیزات</Link>
      </p>
      <header className="profile__head">
        <h1>{listing.title}</h1>
        <p className="profile__meta">
          {[listing.category?.name, listing.brand, listing.model, listing.city].filter(Boolean).join(" · ")}
        </p>
        <p className="prices prices--large">
          {toman(listing.price)}
          {listing.negotiable && <span className="hint"> · قابل مذاکره</span>}
        </p>
        <p className="hint">
          {listing.condition.label}
          {listing.sellerName && ` · فروشنده: ${listing.sellerName}`}
        </p>
      </header>

      {listing.photoIds.length > 0 && (
        <section aria-label="عکس‌ها">
          <ul className="showcase">
            {listing.photoIds.map((photoId) => (
              <li key={photoId} className="showcase__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listingPhotoUrl(id, photoId)} alt={listing.title} loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {listing.description && (
        <section>
          <h2>توضیحات</h2>
          <p className="prose">{listing.description}</p>
        </section>
      )}

      <section>
        <h2>خرید یا پیشنهاد قیمت</h2>
        {me ? (
          <OfferForm listingId={id} price={listing.price} />
        ) : (
          <p className="hint">
            برای فرستادن پیشنهاد اول <Link href={`/login?next=${encodeURIComponent(`/market/${id}`)}`}>وارد شو</Link>. راه
            ارتباط فروشنده بعد از قبول شدن پیشنهادت نشون داده می‌شه.
          </p>
        )}
      </section>
    </article>
  );
}
