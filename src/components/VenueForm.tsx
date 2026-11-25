"use client";

import { useActionState } from "react";
import { saveVenueAction, type VenueFormState } from "@/app/me/venues/actions";
import type { MyVenueDetails, VenueTypeOption } from "@/lib/types";

const idle: VenueFormState = { status: "idle" };

/** The venue's details. An empty field is cleared; the name cannot be empty. */
export function VenueForm({ venue, types }: { venue: MyVenueDetails; types: VenueTypeOption[] }) {
  const [state, action, pending] = useActionState(saveVenueAction.bind(null, venue.id), idle);

  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="name">اسم مکان *</label>
        <input id="name" name="name" defaultValue={venue.name} maxLength={100} required />
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="type">نوع</label>
          <select id="type" name="type" defaultValue={venue.type?.key ?? ""}>
            <option value="">مشخص نشده</option>
            {types.map((type) => (
              <option key={type.key} value={type.key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="city">شهر</label>
          <input id="city" name="city" defaultValue={venue.city ?? ""} maxLength={100} />
          <p className="hint">بدون شهر، مکان توی فهرست عمومی نمی‌آد.</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="address">آدرس</label>
        <input id="address" name="address" defaultValue={venue.address ?? ""} maxLength={300} />
      </div>

      <div className="field">
        <label htmlFor="phone">تلفن</label>
        <input id="phone" name="phone" dir="ltr" inputMode="tel" defaultValue={venue.phone ?? ""} maxLength={30} />
      </div>

      <div className="field">
        <label htmlFor="description">توضیحات</label>
        <textarea id="description" name="description" rows={4} defaultValue={venue.description ?? ""} maxLength={1000} />
      </div>

      <div className="field">
        <label htmlFor="amenities">امکانات</label>
        <textarea id="amenities" name="amenities" rows={2} defaultValue={venue.amenities ?? ""} maxLength={500}
          placeholder="مثلاً: پارکینگ، نور طبیعی، اتاق گریم" />
      </div>

      <div className="field">
        <label>
          <input type="checkbox" name="active" defaultChecked={venue.active} /> فعال (برای دیگران دیده بشه)
        </label>
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ذخیره…" : "ذخیره"}
      </button>
      {state.status === "saved" && (
        <p role="status" className="form__ok">
          ذخیره شد.
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
