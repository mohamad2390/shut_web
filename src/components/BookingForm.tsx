"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { requestBookingAction, type BookingFormState } from "@/app/venues/[id]/actions";
import { jalali } from "@/lib/format";

const idle: BookingFormState = { status: "idle" };

/** Asks the owner for one of the free days. Only days the owner marked free can be picked. */
export function BookingForm({ venueId, freeDays }: { venueId: number; freeDays: string[] }) {
  const [state, action, pending] = useActionState(requestBookingAction.bind(null, venueId), idle);
  const [wholeDay, setWholeDay] = useState(true);

  if (freeDays.length === 0) {
    return <p className="empty">فعلاً روز آزادی توی تقویم نیست. بعداً دوباره سر بزن یا با مالک هماهنگ کن.</p>;
  }

  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="date">روز</label>
        <select id="date" name="date" required defaultValue="">
          <option value="" disabled>
            انتخاب کن
          </option>
          {freeDays.map((day) => (
            <option key={day} value={day}>
              {jalali(day)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>
          <input type="checkbox" name="wholeDay" checked={wholeDay} onChange={(e) => setWholeDay(e.target.checked)} />{" "}
          تمام روز
        </label>
      </div>
      {!wholeDay && (
        <div className="form__row">
          <div className="field">
            <label htmlFor="startTime">از ساعت</label>
            <input id="startTime" name="startTime" type="time" dir="ltr" required />
          </div>
          <div className="field">
            <label htmlFor="endTime">تا ساعت</label>
            <input id="endTime" name="endTime" type="time" dir="ltr" required />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="note">توضیح برای مالک</label>
        <textarea id="note" name="note" rows={3} maxLength={500} placeholder="مثلاً: عکاسی پرتره، دو نفر، حدود سه ساعت" />
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ارسال…" : "ارسال درخواست"}
      </button>
      {state.status === "sent" && (
        <p role="status" className="form__ok">
          درخواستت رفت. جواب مالک رو توی <Link href="/me/bookings">درخواست‌های من</Link> می‌بینی.
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
