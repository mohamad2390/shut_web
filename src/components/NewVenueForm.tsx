"use client";

import { useActionState } from "react";
import { createVenueAction, type VenueFormState } from "@/app/me/venues/actions";

const idle: VenueFormState = { status: "idle" };

export function NewVenueForm() {
  const [state, action, pending] = useActionState(createVenueAction, idle);
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="name">اسم مکان جدید</label>
        <input id="name" name="name" maxLength={100} required placeholder="مثلاً: استودیو نور" />
        <p className="hint">بقیه‌ی اطلاعات رو بعد از ساختن می‌نویسی. عکس مکان فقط از ربات اضافه می‌شه.</p>
      </div>
      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ساختن…" : "ساختن مکان"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="form__error">
          {state.message}
        </p>
      )}
    </form>
  );
}
