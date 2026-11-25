import type { Metadata } from "next";
import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { faDigits, jalali } from "@/lib/format";
import type { Booking } from "@/lib/types";

export const metadata: Metadata = { title: "درخواست‌های رزرو من" };

function hours(booking: Booking): string {
  if (booking.fullDay || !booking.startTime || !booking.endTime) return "تمام روز";
  return faDigits(`${booking.startTime.slice(0, 5)} تا ${booking.endTime.slice(0, 5)}`);
}

export default async function MyBookingsPage() {
  await requireMe("/me/bookings");
  const bookings = await authedGet<Booking[]>("/api/v1/me/bookings");

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>درخواست‌های رزرو من</h1>
        <p>آخرین ۱۰ درخواستی که برای مکان‌ها فرستادی.</p>
      </section>

      {bookings.length === 0 ? (
        <p className="empty">
          هنوز درخواستی نفرستادی. از <Link href="/venues">فهرست مکان‌ها</Link> یک مکان انتخاب کن.
        </p>
      ) : (
        <ul className="price-menu">
          {bookings.map((booking) => (
            <li key={booking.id} className="price-menu__row">
              <span className="price-menu__name">
                <Link href={`/venues/${booking.venueId}`}>{booking.venueName}</Link>
              </span>
              <span className="price-menu__amount">
                {jalali(booking.date)} · {hours(booking)}
              </span>
              <span className="price-menu__actions">{booking.status.label}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
