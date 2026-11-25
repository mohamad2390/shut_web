"use client";

import { useState, useTransition } from "react";
import { addPriceAction, deletePriceAction, updatePriceAction } from "@/app/me/actions";
import { fa, toman } from "@/lib/format";
import type { PriceItem, PricingCatalog } from "@/lib/types";

/** The member's price menu: change a price or its unit, delete it, or add a new one. */
export function PricingEditor({ items, catalog }: { items: PriceItem[]; catalog: PricingCatalog }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<number | null>(null);
  const [amountText, setAmountText] = useState("");
  const [unitKey, setUnitKey] = useState("");

  const [serviceId, setServiceId] = useState<number>(catalog.services[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [newUnit, setNewUnit] = useState(catalog.units[0]?.key ?? "");
  const [newAmount, setNewAmount] = useState("");

  const service = catalog.services.find((entry) => entry.id === serviceId);
  const full = items.length >= catalog.maxItems;

  function run(action: () => Promise<{ ok: true } | { ok: false; message: string }>, done?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) done?.();
      else setError(result.message);
    });
  }

  function startEdit(item: PriceItem) {
    setEditing(item.id);
    setAmountText(String(item.amount));
    setUnitKey(item.unit.key);
  }

  return (
    <>
      {items.length === 0 ? (
        <p className="empty">هنوز قیمتی ننوشتی. از فرم پایین اولین قیمت رو اضافه کن.</p>
      ) : (
        <ul className="price-menu">
          {items.map((item) => (
            <li key={item.id} className="price-menu__row">
              {editing === item.id ? (
                <form
                  className="price-menu__edit"
                  onSubmit={(event) => {
                    event.preventDefault();
                    run(() => updatePriceAction(item.id, unitKey, amountText), () => setEditing(null));
                  }}
                >
                  <strong>
                    {item.icon} {item.title}
                  </strong>
                  <input
                    aria-label="قیمت به تومان"
                    inputMode="numeric"
                    dir="ltr"
                    value={amountText}
                    onChange={(event) => setAmountText(event.target.value)}
                    required
                  />
                  <select aria-label="واحد" value={unitKey} onChange={(event) => setUnitKey(event.target.value)}>
                    {catalog.units.map((unit) => (
                      <option key={unit.key} value={unit.key}>
                        {unit.icon} {unit.label}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="button" disabled={pending}>
                    ذخیره
                  </button>
                  <button type="button" className="link-button" onClick={() => setEditing(null)}>
                    انصراف
                  </button>
                </form>
              ) : (
                <>
                  <span className="price-menu__name">
                    {item.icon} {item.title}
                  </span>
                  <span className="price-menu__amount">
                    {toman(item.amount)} <span className="prices__label">{item.unit.label}</span>
                  </span>
                  <span className="price-menu__actions">
                    <button type="button" className="link-button" onClick={() => startEdit(item)} disabled={pending}>
                      ویرایش
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm(`«${item.title}» پاک بشه؟`)) run(() => deletePriceAction(item.id));
                      }}
                    >
                      حذف
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 className="form__title">قیمت جدید</h2>
      {full ? (
        <p className="hint">تعرفه‌ات پر شده ({fa(catalog.maxItems)} قیمت). برای اضافه کردن، یکی رو پاک کن.</p>
      ) : (
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault();
            run(
              () => addPriceAction({ serviceId, title, unit: newUnit, amount: newAmount }),
              () => {
                setTitle("");
                setNewAmount("");
              },
            );
          }}
        >
          <div className="form__row">
            <div className="field">
              <label htmlFor="service">خدمت</label>
              <select id="service" value={serviceId} onChange={(event) => setServiceId(Number(event.target.value))}>
                {catalog.services.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.icon} {entry.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="unit">واحد</label>
              <select id="unit" value={newUnit} onChange={(event) => setNewUnit(event.target.value)}>
                {catalog.units.map((unit) => (
                  <option key={unit.key} value={unit.key}>
                    {unit.icon} {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="amount">قیمت (تومان)</label>
              <input id="amount" inputMode="numeric" dir="ltr" value={newAmount}
                onChange={(event) => setNewAmount(event.target.value)} placeholder="500000" required />
            </div>
          </div>
          {service?.asksName && (
            <div className="field">
              <label htmlFor="title">اسم این قیمت</label>
              <input id="title" value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)}
                placeholder="مثلاً: پرتره‌ی خانوادگی" />
            </div>
          )}
          <button type="submit" className="button" disabled={pending || catalog.services.length === 0}>
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
