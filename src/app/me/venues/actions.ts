"use server";

import { redirect } from "next/navigation";
import { authed } from "@/lib/backend";
import { FALLBACK, failure, send } from "@/lib/mutate";
import { parseAmount } from "@/lib/format";
import type { CalendarStatus, MutationResult, MyVenueDetails } from "@/lib/types";

export type VenueFormState = { status: "idle" } | { status: "saved" } | { status: "error"; message: string };

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Makes a venue with just a name, then opens it so the owner can fill in the rest. */
export async function createVenueAction(_previous: VenueFormState, data: FormData): Promise<VenueFormState> {
  const name = text(data, "name");
  if (!name) return { status: "error", message: "اسم مکان رو بنویس." };

  let created: MyVenueDetails;
  try {
    const response = await authed("POST", "/api/v1/me/venues", { name });
    if (!response.ok) {
      const result = await failure(response);
      return { status: "error", message: result.ok ? FALLBACK : result.message };
    }
    created = (await response.json()) as MyVenueDetails;
  } catch {
    return { status: "error", message: FALLBACK };
  }
  redirect(`/me/venues/${created.id}`);
}

export async function saveVenueAction(
  venueId: number,
  _previous: VenueFormState,
  data: FormData,
): Promise<VenueFormState> {
  const name = text(data, "name");
  if (!name) return { status: "error", message: "اسم مکان لازم است." };

  const result = await send(
    "PUT",
    `/api/v1/me/venues/${venueId}`,
    {
      name,
      type: text(data, "type"),
      city: text(data, "city"),
      address: text(data, "address"),
      description: text(data, "description"),
      amenities: text(data, "amenities"),
      phone: text(data, "phone"),
      active: data.get("active") === "on",
    },
    ["/me/venues", `/me/venues/${venueId}`, "/venues", `/venues/${venueId}`],
  );
  return result.ok ? { status: "saved" } : { status: "error", message: result.message };
}

export async function addVenuePriceAction(
  venueId: number,
  price: { unit: string; title: string; amount: string },
): Promise<MutationResult> {
  const amount = parseAmount(price.amount);
  if (amount === null) return { ok: false, message: "قیمت رو فقط با عدد و به تومان بنویس؛ مثلاً ۵۰۰۰۰۰." };
  return send(
    "POST",
    `/api/v1/me/venues/${venueId}/prices`,
    { unit: price.unit, title: price.title.trim() || null, amount },
    [`/me/venues/${venueId}`, "/me/venues", `/venues/${venueId}`],
  );
}

export async function deleteVenuePriceAction(venueId: number, priceId: number): Promise<MutationResult> {
  return send("DELETE", `/api/v1/me/venues/${venueId}/prices/${priceId}`, undefined, [
    `/me/venues/${venueId}`,
    "/me/venues",
    `/venues/${venueId}`,
  ]);
}

/** @param status null clears the day */
export async function markVenueDayAction(
  venueId: number,
  date: string,
  status: CalendarStatus | null,
): Promise<MutationResult> {
  return send("PUT", `/api/v1/me/venues/${venueId}/calendar/${encodeURIComponent(date)}`, { status }, [
    `/venues/${venueId}`,
  ]);
}

export async function answerRequestAction(venueId: number, bookingId: number, accept: boolean): Promise<MutationResult> {
  return send("PUT", `/api/v1/me/venues/${venueId}/requests/${bookingId}`, { accept }, [
    `/me/venues/${venueId}`,
    "/me/venues",
  ]);
}
