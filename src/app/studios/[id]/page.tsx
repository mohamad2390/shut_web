import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStudio, studioMediaUrl } from "@/lib/api";
import { phoneDigits, toman } from "@/lib/format";

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const studio = await getStudio(parseId((await params).id));
  return studio ? { title: studio.name, description: studio.description ?? undefined } : {};
}

export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const studio = await getStudio(id);
  if (!studio) notFound();
  const phone = phoneDigits(studio.phone);

  return (
    <article className="profile">
      <p className="back">
        <Link href="/studios">← همه‌ی استودیوها</Link>
      </p>

      <header className="profile__head">
        <h1>{studio.name}</h1>
        <p className="profile__meta">
          {[`مدیر: ${studio.managerName}`, studio.city, studio.address].join(" · ")}
        </p>
        <ul className="contacts" aria-label="راه‌های ارتباط با استودیو">
          {studio.ownerTelegramUsername && (
            <li>
              <a href={`https://t.me/${studio.ownerTelegramUsername}`} rel="noopener noreferrer">
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

      {studio.description && <p className="prose">{studio.description}</p>}

      <section>
        <h2>پکیج‌ها</h2>
        <ul className="grid">
          {studio.offerings.map((offering) => (
            <li key={offering.id} className="card card--static">
              <h3 className="card__name">{offering.title}</h3>
              {offering.services.length > 0 && <p className="card__city">{offering.services.join("، ")}</p>}
              <p className="prices__amount">{offering.price === null ? "با تماس" : toman(offering.price)}</p>
            </li>
          ))}
        </ul>
      </section>

      {studio.media.length > 0 && (
        <section aria-label="نمونه‌کارها">
          <h2>نمونه‌کارها</h2>
          <ul className="showcase">
            {studio.media.map((media) => (
              <li key={media.id} className="showcase__item">
                {media.kind === "VIDEO" ? (
                  <video src={studioMediaUrl(id, media.id)} controls preload="none" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={studioMediaUrl(id, media.id)} alt={`نمونه‌کار ${studio.name}`} loading="lazy" />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {studio.people.length > 0 && (
        <section>
          <h2>افراد استودیو</h2>
          <ul className="contacts">
            {studio.people.map((person) => (
              <li key={person.userId}>
                <Link href={`/providers/${person.userId}`}>{person.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
