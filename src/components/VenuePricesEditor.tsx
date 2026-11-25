"use client";

import { useState, useTransition } from "react";
import { addVenuePriceAction, deleteVenuePriceAction } from "@/app/me/venues/actions";
import { fa, toman } from "@/lib/format";
import type { Label, MyVenuePrice } from "@/lib/types";

/** A venue's prices: add one (unit, amount, optional name) or delete one. */
export function VenuePricesEditor({
  venueId,
  prices,
  units,
  max,
}: {
  venueId: number;
  prices: MyVenuePrice[];
  units: Label[];
  max: number;
}) {
  const [unit, setUnit] = useState(units[0]?.key ?? "");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: true } | { ok: false; message: string }>, done?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) done?.();
      else setError(result.message);
    });
  }

  return (
    <>
      {prices.length === 0 ? (
        <p className="empty">هنوز قیمتی ننوشتی. بدون قیمت، مکان توی فهرست عمومی نمی‌آد.</p>
      ) : (
        <ul className="price-menu">
          {prices.map((price) => (
            <li key={price.id} className="price-menu__row">
              <span className="price-menu__name">{price.title ?? "قیمت"}</span>
              <span className="price-menu__amount">
                {toman(price.amount)} <span className="prices__label">{price.unit.label}</span>
              </span>
              <span className="price-menu__actions">
                <button
                  type="button"
                  className="link-button"
                  disabled={pending}
                  onClick={() => {
                    if (window.confirm("این قیمت پاک بشه؟")) run(() => deleteVenuePriceAction(venueId, price.id));
                  }}
                >
                  حذف
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {prices.length >= max ? (
        <p className="hint">قیمت‌ها پر شده ({fa(max)} قیمت). برای اضافه کردن، یکی رو پاک کن.</p>
      ) : (
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            run(
              () => addVenuePriceAction(venueId, { unit, title, amount }),
              () => {
                setTitle("");
                setAmount("");
              },
            );
          }}
        >
          <div className="form__row">
            <div className="field">
              <label htmlFor="price-unit">واحد</label>
              <select id="price-unit" value={unit} onChange={(event) => setUnit(event.target.value)}>
                {units.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="price-amount">قیمت (تومان)</label>
              <input id="price-amount" inputMode="numeric" dir="ltr" value={amount} placeholder="2000000"
                onChange={(event) => setAmount(event.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="price-title">اسم این قیمت (اختیاری)</label>
            <input id="price-title" value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)}
              placeholder="مثلاً: سالن اصلی" />
          </div>
          <button type="submit" className="button" disabled={pending || units.length === 0}>
            {pending ? "در حال ذخیره…" : "افزودن قیمت"}
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="form__error">
          {error}
        </p>
      )}
    </>
  );
}
