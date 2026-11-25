"use server";

import { parseAmount } from "@/lib/format";
import { send } from "@/lib/mutate";

export type OfferFormState = { status: "idle" } | { status: "sent" } | { status: "error"; message: string };

function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function makeOfferAction(listingId: number, _previous: OfferFormState, data: FormData): Promise<OfferFormState> {
  const amountText = text(data, "amount");
  let amount: number | null = null;
  if (data.get("atAskingPrice") !== "on") {
    amount = parseAmount(amountText);
    if (amount === null) {
      return { status: "error", message: "مبلغ رو فقط با عدد و به تومان بنویس، یا «با قیمت آگهی می‌خرم» رو بزن." };
    }
  }
  const result = await send(
    "POST",
    `/api/v1/market/listings/${listingId}/offers`,
    { amount, message: text(data, "message") || null },
    ["/me/offers"],
  );
  return result.ok ? { status: "sent" } : { status: "error", message: result.message };
}
