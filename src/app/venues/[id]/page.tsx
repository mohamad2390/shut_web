import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PriceList } from "@/components/PriceList";
import { VenueCalendar } from "@/components/VenueCalendar";
import { getMe } from "@/lib/auth";
import { getVenue, getVenueCalendar, venuePhotoUrl } from "@/lib/api";
import { addDays, phoneDigits, todayInIran } from "@/lib/format";

/** How many days of the calendar to show. The API allows up to 93. */
const CALENDAR_DAYS = 31;

function parseId(text: string): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const venue = await getVenue(parseId((await params).id));
  return venue ? { title: venue.name, description: venue.description ?? undefined } : {};
}

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const venue = await getVenue(id);
  if (!venue) notFound();

  const from = todayInIran();
  const marked = await getVenueCalendar(id, from, addDays(from, CALENDAR_DAYS - 1));
  const phone = phoneDigits(venue.phone);
  const me = await getMe();
  const freeDays = marked.filter((day) => day.status === "FREE").map((day) => day.date);

  return (
    <article className="profile">
      <p className="back">
        <Link href="/venues">← همه‌ی مکان‌ها</Link>
      </p>

      <header className="profile__head">
        <h1>{venue.name}</h1>
        <p className="profile__meta">
          {[venue.type?.label, venue.city, venue.address].filter(Boolean).join(" · ")}
        </p>
        <ul className="contacts" aria-label="راه‌های ارتباط با مالک">
          {venue.ownerTelegramUsername && (
            <li>
              <a href={`https://t.me/${venue.ownerTelegramUsername}`} rel="noopener noreferrer">
                پیام به مالک در تلگرام
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

      {venue.photos.length > 0 && (
        <section aria-label="عکس‌ها">
          <ul className="showcase">
            {venue.photos.map((photo) => (
              <li key={photo.id} className="showcase__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={venuePhotoUrl(id, photo.id)} alt={`${venue.name}`} loading="lazy" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>قیمت‌ها</h2>
        <PriceList prices={venue.prices} large />
      </section>

      {venue.description && (
        <section>
          <h2>درباره‌ی مکان</h2>
          <p className="prose">{venue.description}</p>
        </section>
      )}

      {venue.amenities && (
        <section>
          <h2>امکانات</h2>
          <p className="prose">{venue.amenities}</p>
        </section>
      )}

      <section>
        <h2>تقویم</h2>
        <p className="hint">
          «آزاد» یعنی مالک آن روز را آزاد گذاشته. چند گروه می‌توانند در یک ساعت از مکان استفاده کنند؛ زمان دقیق را با مالک هماهنگ کن.
        </p>
        <VenueCalendar from={from} days={CALENDAR_DAYS} marked={marked} />
      </section>

      <section>
        <h2>درخواست رزرو</h2>
        {me ? (
          <BookingForm venueId={id} freeDays={freeDays} />
        ) : (
          <p className="hint">
            برای فرستادن درخواست اول <Link href={`/login?next=${encodeURIComponent(`/venues/${id}`)}`}>وارد شو</Link>.
          </p>
        )}
      </section>
    </article>
  );
}
