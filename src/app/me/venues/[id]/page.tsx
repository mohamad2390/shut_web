import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarEditor } from "@/components/CalendarEditor";
import { VenueForm } from "@/components/VenueForm";
import { VenuePricesEditor } from "@/components/VenuePricesEditor";
import { VenueRequests } from "@/components/VenueRequests";
import { ApiError, getVenueCatalog } from "@/lib/api";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import { addDays, fa, todayInIran } from "@/lib/format";
import type { CalendarDay, MyVenueDetails, OwnerRequest } from "@/lib/types";
import { markVenueDayAction } from "../actions";

export const metadata: Metadata = { title: "مدیریت مکان" };

const CALENDAR_DAYS = 31;

const MISSING: Record<string, string> = {
  CITY: "شهر رو بنویس",
  PRICE: "حداقل یک قیمت اضافه کن",
};

export default async function MyVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idText } = await params;
  const id = Number(idText);
  if (!Number.isInteger(id) || id <= 0) notFound();
  await requireMe(`/me/venues/${id}`);

  const from = todayInIran();
  let venue: MyVenueDetails;
  let requests: OwnerRequest[];
  let marked: CalendarDay[];
  try {
    [venue, requests, marked] = await Promise.all([
      authedGet<MyVenueDetails>(`/api/v1/me/venues/${id}`),
      authedGet<OwnerRequest[]>(`/api/v1/me/venues/${id}/requests`),
      authedGet<CalendarDay[]>(`/api/v1/me/venues/${id}/calendar?from=${from}&to=${addDays(from, CALENDAR_DAYS - 1)}`),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  const catalog = await getVenueCatalog();

  return (
    <>
      <p className="back">
        <Link href="/me/venues">← مکان‌های من</Link>
      </p>
      <section className="hero">
        <h1>{venue.name}</h1>
        {venue.listed ? (
          <p>
            این مکان توی فهرست عمومی هست. <Link href={`/venues/${venue.id}`}>دیدن صفحه‌ی عمومی</Link>
          </p>
        ) : (
          <p className="notice">
            این مکان هنوز توی فهرست عمومی نیست
            {!venue.active && " چون غیرفعاله"}
            {venue.missing.length > 0 && `: ${venue.missing.map((key) => MISSING[key] ?? key).join("، ")}`}.
          </p>
        )}
      </section>

      <section>
        <h2>درخواست‌های منتظر جواب</h2>
        <VenueRequests venueId={id} requests={requests} />
      </section>

      <section>
        <h2>اطلاعات مکان</h2>
        <VenueForm venue={venue} types={catalog.types} />
      </section>

      <section>
        <h2>قیمت‌ها</h2>
        <VenuePricesEditor venueId={id} prices={venue.prices} units={catalog.priceUnits} max={catalog.maxPrices} />
      </section>

      <section>
        <h2>تقویم</h2>
        <p className="hint">فقط روزهای «آزاد» برای درخواست رزرو قابل انتخاب هستن. هر بار زدن، وضعیت روز عوض می‌شه.</p>
        <CalendarEditor from={from} days={CALENDAR_DAYS} marked={marked} mark={markVenueDayAction.bind(null, id)} />
      </section>

      <section>
        <h2>عکس‌ها</h2>
        <p className="hint">
          {venue.photoCount > 0 ? `${fa(venue.photoCount)} عکس داری. ` : "هنوز عکسی نداری. "}
          عکس مکان فقط از ربات تلگرام اضافه یا پاک می‌شه.
        </p>
        {venue.botUrl && (
          <a className="button" href={venue.botUrl} rel="noopener noreferrer">
            مدیریت عکس‌ها در ربات
          </a>
        )}
      </section>
    </>
  );
}
