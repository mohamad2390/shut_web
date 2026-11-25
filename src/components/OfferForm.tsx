"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { makeOfferAction, type OfferFormState } from "@/app/market/[id]/actions";
import { toman } from "@/lib/format";

const idle: OfferFormState = { status: "idle" };

/** A buyer's offer: a price of their own, or «I take it at the asking price». */
export function OfferForm({ listingId, price }: { listingId: number; price: number }) {
  const [state, action, pending] = useActionState(makeOfferAction.bind(null, listingId), idle);
  const [asking, setAsking] = useState(false);

  return (
    <form action={action} className="form">
      <div className="field">
        <label>
          <input type="checkbox" name="atAskingPrice" checked={asking} onChange={(e) => setAsking(e.target.checked)} /> با قیمت
          آگهی می‌خرم ({toman(price)})
        </label>
      </div>
      {!asking && (
        <div className="field">
          <label htmlFor="amount">پیشنهاد من (تومان)</label>
          <input id="amount" name="amount" inputMode="numeric" dir="ltr" placeholder={String(price)} required />
        </div>
      )}
      <div className="field">
        <label htmlFor="message">پیام به فروشنده</label>
        <textarea id="message" name="message" rows={3} maxLength={500} placeholder="مثلاً: امکان دیدن حضوری هست؟" />
      </div>
      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ارسال…" : "ارسال پیشنهاد"}
      </button>
      {state.status === "sent" && (
        <p role="status" className="form__ok">
          پیشنهادت رفت. بعد از قبول شدن، راه ارتباط فروشنده رو توی <Link href="/me/offers">پیشنهادهای من</Link> می‌بینی.
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="form__error">
          {state.message}
        </p>
      )}
    </form>
  );
}
