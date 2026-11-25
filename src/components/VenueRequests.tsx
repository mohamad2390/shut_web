"use client";

import { useState, useTransition } from "react";
import { answerRequestAction } from "@/app/me/venues/actions";
import { faDigits, jalali } from "@/lib/format";
import type { OwnerRequest } from "@/lib/types";

function hours(request: OwnerRequest): string {
  if (request.fullDay || !request.startTime || !request.endTime) return "تمام روز";
  return faDigits(`${request.startTime.slice(0, 5)} تا ${request.endTime.slice(0, 5)}`);
}

/** Requests waiting for the owner's answer. Accepting does not mark the day busy; the owner does that in the calendar. */
export function VenueRequests({ venueId, requests }: { venueId: number; requests: OwnerRequest[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (requests.length === 0) return <p className="empty">درخواستی منتظر جواب نیست.</p>;

  function answer(id: number, accept: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await answerRequestAction(venueId, id, accept);
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <>
      <ul className="price-menu">
        {requests.map((request) => {
          const who = request.requester;
          return (
            <li key={request.id} className="price-menu__row">
              <span className="price-menu__name">
                {who.name ?? "کاربر"}
                {who.telegramUsername && (
                  <>
                    {" "}
                    <a href={`https://t.me/${who.telegramUsername}`} rel="noopener noreferrer">
                      @{who.telegramUsername}
                    </a>
                  </>
                )}
                {!who.telegramUsername && who.phone && (
                  <>
                    {" "}
                    <a href={`tel:${who.phone}`} dir="ltr">
                      {faDigits(who.phone)}
                    </a>
                  </>
                )}
              </span>
              <span className="price-menu__amount">
                {jalali(request.date)} · {hours(request)}
                {request.note && <span className="hint"> {request.note}</span>}
              </span>
              <span className="price-menu__actions">
                <button type="button" className="button" disabled={pending} onClick={() => answer(request.id, true)}>
                  قبول
                </button>
                <button type="button" className="link-button" disabled={pending} onClick={() => answer(request.id, false)}>
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
