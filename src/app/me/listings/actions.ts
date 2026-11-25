"use server";

import { redirect } from "next/navigation";
import { authed } from "@/lib/backend";
import { parseAmount } from "@/lib/format";
import { FALLBACK, failure, send } from "@/lib/mutate";
import type { MutationResult, MyListing } from "@/lib/types";

export type ListingFormState = { status: "idle" } | { status: "saved" } | { status: "error"; message: string };

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** The fields of the listing form as the API wants them. Returns an error sentence when something is wrong. */
function body(data: FormData): { ok: true; value: Record<string, unknown> } | { ok: false; message: string } {
  const title = text(data, "title");
  if (!title) return { ok: false, message: "عنوان آگهی رو بنویس." };
  const price = parseAmount(text(data, "price"));
  if (price === null) return { ok: false, message: "قیمت رو فقط با عدد و به تومان بنویس؛ مثلاً ۵۰۰۰۰۰۰۰." };
  const category = Number(text(data, "categoryId"));
  return {
    ok: true,
    value: {
      title,
      condition: text(data, "condition"),
      price,
      negotiable: data.get("negotiable") === "on",
      categoryId: Number.isInteger(category) ? category : 0,
      brand: text(data, "brand"),
      model: text(data, "model"),
      city: text(data, "city"),
      description: text(data, "description"),
    },
  };
}

export async function createListingAction(_previous: ListingFormState, data: FormData): Promise<ListingFormState> {
  const parsed = body(data);
  if (!parsed.ok) return { status: "error", message: parsed.message };

  let created: MyListing;
  try {
    const response = await authed("POST", "/api/v1/me/listings", parsed.value);
    if (!response.ok) {
      const result = await failure(response);
      return { status: "error", message: result.ok ? FALLBACK : result.message };
    }
    created = (await response.json()) as MyListing;
  } catch {
    return { status: "error", message: FALLBACK };
  }
  redirect(`/me/listings/${created.id}`);
}

export async function saveListingAction(id: number, _previous: ListingFormState, data: FormData): Promise<ListingFormState> {
  const parsed = body(data);
  if (!parsed.ok) return { status: "error", message: parsed.message };
  const result = await send("PUT", `/api/v1/me/listings/${id}`, parsed.value, [
    "/me/listings",
    `/me/listings/${id}`,
    "/market",
    `/market/${id}`,
  ]);
  return result.ok ? { status: "saved" } : { status: "error", message: result.message };
}

export async function setListingStatusAction(id: number, status: "ACTIVE" | "SOLD" | "CLOSED"): Promise<MutationResult> {
  return send("PUT", `/api/v1/me/listings/${id}/status`, { status }, [
    "/me/listings",
    `/me/listings/${id}`,
    "/market",
    `/market/${id}`,
  ]);
}

export async function answerOfferAction(listingId: number, offerId: number, accept: boolean): Promise<MutationResult> {
  return send("PUT", `/api/v1/me/listings/${listingId}/offers/${offerId}`, { accept }, [
    `/me/listings/${listingId}`,
    "/me/listings",
  ]);
}

export async function withdrawOfferAction(offerId: number): Promise<MutationResult> {
  return send("DELETE", `/api/v1/me/offers/${offerId}`, undefined, ["/me/offers"]);
}
