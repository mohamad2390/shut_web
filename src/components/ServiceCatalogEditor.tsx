"use client";

import { useState, useTransition } from "react";
import {
  createServiceAction,
  setUnitIconAction,
  updateServiceAction,
  type ServiceInput,
} from "@/app/admin/actions";
import { fa } from "@/lib/format";
import type { AdminService, AdminUnit, MutationResult } from "@/lib/types";

const EMPTY: ServiceInput = { name: "", icon: "", sortOrder: 0, asksName: false, active: true };

function ServiceFields({ value, onChange }: { value: ServiceInput; onChange: (next: ServiceInput) => void }) {
  return (
    <>
      <div className="form__row">
        <div className="field">
          <label>اسم</label>
          <input value={value.name} maxLength={60} onChange={(e) => onChange({ ...value, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>آیکن</label>
          <input value={value.icon} maxLength={16} onChange={(e) => onChange({ ...value, icon: e.target.value })} required />
        </div>
        <div className="field">
          <label>ترتیب</label>
          <input
            type="number"
            min={0}
            max={10000}
            dir="ltr"
            value={value.sortOrder}
            onChange={(e) => onChange({ ...value, sortOrder: Number(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="field">
        <label>
          <input type="checkbox" checked={value.asksName} onChange={(e) => onChange({ ...value, asksName: e.target.checked })} />{" "}
          کاربر بتونه برای قیمت اسم دلخواه بنویسه («سایر»)
        </label>
        <label>
          <input type="checkbox" checked={value.active} onChange={(e) => onChange({ ...value, active: e.target.checked })} /> فعال
          (کاربرها بتونن انتخابش کنن)
        </label>
      </div>
    </>
  );
}

/** The services members can price, and the icon of each unit. A service is switched off, never deleted. */
export function ServiceCatalogEditor({ services, units }: { services: AdminService[]; units: AdminUnit[] }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<ServiceInput>(EMPTY);
  const [fresh, setFresh] = useState<ServiceInput>(EMPTY);
  const [icons, setIcons] = useState<Record<string, string>>(() => Object.fromEntries(units.map((u) => [u.key, u.icon])));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<MutationResult>, done?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) done?.();
      else setError(result.message);
    });
  }

  return (
    <>
      <ul className="price-menu">
        {services.map((service) => (
          <li key={service.id} className="price-menu__row">
            {editing === service.id ? (
              <form
                className="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  run(() => updateServiceAction(service.id, draft), () => setEditing(null));
                }}
              >
                <ServiceFields value={draft} onChange={setDraft} />
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
                  {service.icon} {service.name}
                  {!service.active && " (غیرفعال)"}
                </span>
                <span className="price-menu__amount hint">
                  ترتیب {fa(service.sortOrder)}
                  {service.asksName && " · اسم دلخواه"}
                </span>
                <span className="price-menu__actions">
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setEditing(service.id);
                      setDraft({
                        name: service.name,
                        icon: service.icon,
                        sortOrder: service.sortOrder,
                        asksName: service.asksName,
                        active: service.active,
                      });
                    }}
                  >
                    ویرایش
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="form__title">خدمت جدید</h2>
      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => createServiceAction(fresh), () => setFresh(EMPTY));
        }}
      >
        <ServiceFields value={fresh} onChange={setFresh} />
        <button type="submit" className="button" disabled={pending}>
          افزودن خدمت
        </button>
      </form>

      <h2 className="form__title">آیکن واحدها</h2>
      <p className="hint">خود واحدها ثابتن؛ فقط آیکنشون عوض می‌شه.</p>
      <ul className="price-menu">
        {units.map((unit) => (
          <li key={unit.key} className="price-menu__row">
            <span className="price-menu__name">{unit.label}</span>
            <span className="price-menu__amount">
              <input
                aria-label={`آیکن ${unit.label}`}
                value={icons[unit.key] ?? ""}
                maxLength={16}
                onChange={(e) => setIcons({ ...icons, [unit.key]: e.target.value })}
              />
            </span>
            <span className="price-menu__actions">
              <button
                type="button"
                className="link-button"
                disabled={pending}
                onClick={() => run(() => setUnitIconAction(unit.key, icons[unit.key] ?? ""))}
              >
                ذخیره
              </button>
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
