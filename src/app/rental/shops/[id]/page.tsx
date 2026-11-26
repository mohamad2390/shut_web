import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RentalItemCard } from "@/components/RentalItemCard";
import { getRentalShop } from "@/lib/api";
import { phoneDigits } from "@/lib/format";

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const shop = await getRentalShop(parseId((await params).id));
  return shop ? { title: shop.name, description: shop.description ?? undefined } : {};
}

export default async function RentalShopPage({ params }: { params: Promise<{ id: string }> }) {
  const shop = await getRentalShop(parseId((await params).id));
  if (!shop) notFound();
  const phone = phoneDigits(shop.phone);

  return (
    <article className="profile">
      <p className="back">
        <Link href="/rental">← اجاره‌ی تجهیزات</Link>
      </p>

      <header className="profile__head">
        <h1>{shop.name}</h1>
        <p className="profile__meta">{[shop.city, shop.address].join(" · ")}</p>
        <ul className="contacts" aria-label="راه‌های ارتباط با مغازه">
          {shop.ownerTelegramUsername && (
            <li>
              <a href={`https://t.me/${shop.ownerTelegramUsername}`} rel="noopener noreferrer">
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
      </header>

      {shop.description && <p className="prose">{shop.description}</p>}

      <section>
        <h2>تجهیزات موجود</h2>
        <ul className="grid">
          {shop.items.map((item) => (
            <RentalItemCard key={item.id} item={item} />
          ))}
        </ul>
      </section>
    </article>
  );
}
