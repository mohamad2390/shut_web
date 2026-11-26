import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRentalItem, rentalPhotoUrl } from "@/lib/api";
import { phoneDigits, toman } from "@/lib/format";

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const item = await getRentalItem(parseId((await params).id));
  return item ? { title: `اجاره‌ی ${item.title}`, description: item.description ?? undefined } : {};
}

export default async function RentalItemPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const item = await getRentalItem(id);
  if (!item) notFound();
  const phone = phoneDigits(item.shopPhone);

  return (
    <article className="profile">
      <p className="back">
        <Link href={`/rental/shops/${item.shopId}`}>← {item.shopName}</Link>
      </p>

      <header className="profile__head">
        <h1>{item.title}</h1>
        <p className="profile__meta">
          {[item.typeIcon && `${item.typeIcon} ${item.typeName}`, `${toman(item.dailyPrice)} در روز`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {item.photoIds.length > 0 && (
        <section aria-label="عکس‌ها">
          <ul className="showcase">
            {item.photoIds.map((photoId) => (
              <li key={photoId} className="showcase__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={rentalPhotoUrl(id, photoId)} alt={item.title} loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.description && <p className="prose">{item.description}</p>}

      <section>
        <h2>تحویل و تماس</h2>
        <p className="hint">
          {item.shopName}، {item.shopCity}، {item.shopAddress}. رزرو و پرداخت آنلاین نیست؛ تماس بگیر یا به مغازه برو.
        </p>
        <ul className="contacts">
          {item.ownerTelegramUsername && (
            <li>
              <a href={`https://t.me/${item.ownerTelegramUsername}`} rel="noopener noreferrer">
                پیام در تلگرام
              </a>
            </li>
          )}
          {phone && (
            <li>
              <a href={`tel:${phone}`}>تماس تلفنی</a>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}
