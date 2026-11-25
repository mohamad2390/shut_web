"use client";

import { useState, useTransition } from "react";
import { answerOfferAction } from "@/app/me/listings/actions";
import { faDigits, toman } from "@/lib/format";
import type { SellerOffer } from "@/lib/types";

/** Offers waiting for the seller; the buyer's contact is shown so the seller can reach them. */
export function ListingOffers({ listingId, offers }: { listingId: number; offers: SellerOffer[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (offers.length === 0) return <p className="empty">پیشنهادی منتظر جواب نیست.</p>;

  function answer(id: number, accept: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await answerOfferAction(listingId, id, accept);
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <>
      <ul className="price-menu">
        {offers.map((offer) => {
          const buyer = offer.buyer;
          return (
            <li key={offer.id} className="price-menu__row">
              <span className="price-menu__name">
                {buyer.name ?? "کاربر"}
                {buyer.telegramUsername && (
                  <>
                    {" "}
                    <a href={`https://t.me/${buyer.telegramUsername}`} rel="noopener noreferrer">
                      @{buyer.telegramUsername}
                    </a>
                  </>
                )}
                {!buyer.telegramUsername && buyer.phone && (
                  <>
                    {" "}
                    <a href={`tel:${buyer.phone}`} dir="ltr">
                      {faDigits(buyer.phone)}
                    </a>
                  </>
                )}
              </span>
              <span className="price-menu__amount">
                {offer.amount === null ? "با قیمت آگهی" : toman(offer.amount)}
                {offer.message && <span className="hint"> {offer.message}</span>}
              </span>
              <span className="price-menu__actions">
                <button type="button" className="button" disabled={pending} onClick={() => answer(offer.id, true)}>
                  قبول
                </button>
                <button type="button" className="link-button" disabled={pending} onClick={() => answer(offer.id, false)}>
                  رد
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="form__error">
          {error}
        </p>
      )}
    </>
  );
}
