"use client";

import { useActionState } from "react";
import {
  createListingAction,
  saveListingAction,
  type ListingFormState,
} from "@/app/me/listings/actions";
import type { MarketCatalog, MyListing } from "@/lib/types";

const idle: ListingFormState = { status: "idle" };

/** Creates a listing (no {@code listing}) or changes one. */
export function ListingForm({ catalog, listing }: { catalog: MarketCatalog; listing?: MyListing }) {
  const [state, action, pending] = useActionState(
    listing ? saveListingAction.bind(null, listing.id) : createListingAction,
    idle,
  );

  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="title">عنوان *</label>
        <input id="title" name="title" defaultValue={listing?.title ?? ""} maxLength={120} required
          placeholder="مثلاً: سونی A7 III بدنه" />
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="categoryId">دسته</label>
          <select id="categoryId" name="categoryId" defaultValue={listing?.category?.id ?? 0}>
            <option value={0}>مشخص نشده</option>
            {catalog.categories.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.icon} {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="brand">برند</label>
          <input id="brand" name="brand" defaultValue={listing?.brand ?? ""} maxLength={60} />
        </div>
        <div className="field">
          <label htmlFor="model">مدل</label>
          <input id="model" name="model" defaultValue={listing?.model ?? ""} maxLength={80} />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="condition">وضعیت *</label>
          <select id="condition" name="condition" defaultValue={listing?.condition.key ?? "USED"} required>
            {catalog.conditions.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="price">قیمت (تومان) *</label>
          <input id="price" name="price" inputMode="numeric" dir="ltr" defaultValue={listing?.price ?? ""} required />
        </div>
        <div className="field">
          <label htmlFor="city">شهر</label>
          <input id="city" name="city" defaultValue={listing?.city ?? ""} maxLength={100} />
        </div>
      </div>

      <div className="field">
        <label>
          <input type="checkbox" name="negotiable" defaultChecked={listing?.negotiable ?? true} /> قیمت قابل مذاکره است
        </label>
      </div>

      <div className="field">
        <label htmlFor="description">توضیحات</label>
        <textarea id="description" name="description" rows={5} maxLength={2000} defaultValue={listing?.description ?? ""}
          placeholder="تعداد شات، ایرادها، لوازم همراه، دلیل فروش…" />
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ذخیره…" : listing ? "ذخیره" : "ثبت آگهی"}
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
