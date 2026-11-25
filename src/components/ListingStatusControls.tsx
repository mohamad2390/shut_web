"use client";

import { useState, useTransition } from "react";
import { setListingStatusAction } from "@/app/me/listings/actions";

/** Mark sold, close, or put the listing back on the market. */
export function ListingStatusControls({ id, status }: { id: number; status: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function change(next: "ACTIVE" | "SOLD" | "CLOSED", confirm?: string) {
    if (confirm && !window.confirm(confirm)) return;
    setError(null);
    startTransition(async () => {
      const result = await setListingStatusAction(id, next);
      if (!result.ok) setError(result.message);
    });
  }

  return (
    <>
      <p>
        {status === "ACTIVE" ? (
          <>
            <button type="button" className="button" disabled={pending} onClick={() => change("SOLD", "آگهی «فروخته شد» بشه و از بازار برداشته بشه؟")}>
              فروخته شد
            </button>{" "}
            <button type="button" className="link-button" disabled={pending} onClick={() => change("CLOSED", "آگهی از بازار برداشته بشه؟")}>
              بستن آگهی
            </button>
          </>
        ) : (
          <button type="button" className="button" disabled={pending} onClick={() => change("ACTIVE")}>
            دوباره توی بازار بذار
          </button>
        )}
      </p>
      {error && (
        <p role="alert" className="form__error">
          {error}
        </p>
      )}
    </>
  );
}
