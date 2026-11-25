"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { withdrawOfferAction } from "@/app/me/listings/actions";
import { faDigits, toman } from "@/lib/format";
import type { MyOffer } from "@/lib/types";

/** The offers the member made; the seller's contact shows once an offer is accepted. */
export function MyOffersList({ offers }: { offers: MyOffer[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (offers.length === 0) {
    return (
      <p className="empty">
        هنوز پیشنهادی ندادی. از <Link href="/market">بازار تجهیزات</Link> یک آگهی انتخاب کن.
      </p>
    );
  }

  return (
    <>
      <ul className="price-menu">
        {offers.map((offer) => (
          <li key={offer.id} className="price-menu__row">
            <span className="price-menu__name">
              <Link href={`/market/${offer.listingId}`}>{offer.listingTitle}</Link>
            </span>
            <span className="price-menu__amount">
              {offer.amount === null ? "با قیمت آگهی" : toman(offer.amount)} · {offer.status.label}
              {offer.seller && (
                <span className="hint">
                  {" "}
                  فروشنده: {offer.seller.name ?? ""}{" "}
                  {offer.seller.telegramUsername ? (
                    <a href={`https://t.me/${offer.seller.telegramUsername}`} rel="noopener noreferrer">
                      @{offer.seller.telegramUsername}
                    </a>
                  ) : (
                    offer.seller.phone && (
                      <a href={`tel:${offer.seller.phone}`} dir="ltr">
                        {faDigits(offer.seller.phone)}
                      </a>
                    )
                  )}
                </span>
              )}
            </span>
            <span className="price-menu__actions">
              {offer.status.key === "PENDING" && (
                <button
                  type="button"
                  className="link-button"
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm("پیشنهادت پس گرفته بشه؟")) return;
                    setError(null);
                    startTransition(async () => {
                      const result = await withdrawOfferAction(offer.id);
                      if (!result.ok) setError(result.message);
                    });
                  }}
                >
                  پس گرفتن
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="form__error">
          {error}
        </p>
      )}
    </>
  );
}
