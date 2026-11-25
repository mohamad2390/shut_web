"use server";

import { send } from "@/lib/mutate";

export type BookingFormState = { status: "idle" } | { status: "sent" } | { status: "error"; message: string };

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function requestBookingAction(
  venueId: number,
  _previous: BookingFormState,
  data: FormData,
): Promise<BookingFormState> {
  const date = text(data, "date");
  if (!date) return { status: "error", message: "یک روز آزاد انتخاب کن." };

  const wholeDay = data.get("wholeDay") === "on";
  const start = text(data, "startTime");
  const end = text(data, "endTime");
  if (!wholeDay && (!start || !end)) {
    return { status: "error", message: "ساعت شروع و پایان رو بنویس، یا «تمام روز» رو بزن." };
  }

  const result = await send(
    "POST",
    `/api/v1/venues/${venueId}/bookings`,
    { date, startTime: wholeDay ? null : start, endTime: wholeDay ? null : end, note: text(data, "note") || null },
    ["/me/bookings"],
  );
  return result.ok ? { status: "sent" } : { status: "error", message: result.message };
}
