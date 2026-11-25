"use client";

import { useState, useTransition } from "react";
import { markDayAction } from "@/app/me/actions";
import { addDays, jalali } from "@/lib/format";
import type { CalendarDay, CalendarStatus, MutationResult } from "@/lib/types";

type DayState = "UNSET" | CalendarStatus;

const NEXT: Record<DayState, CalendarStatus | null> = { UNSET: "FREE", FREE: "BUSY", BUSY: null };
const TEXT: Record<DayState, string> = { UNSET: "نامشخص", FREE: "آزاد", BUSY: "پر" };

function stateOf(marked: Record<string, CalendarStatus>, date: string): DayState {
  const status: CalendarStatus | undefined = marked[date];
  return status ?? "UNSET";
}

/** Each press moves a day on: نامشخص ← آزاد ← پر ← نامشخص, the same as in the bot. */
export function CalendarEditor({
  from,
  days,
  marked,
  mark = markDayAction,
}: {
  from: string;
  days: number;
  marked: CalendarDay[];
  /** Saves one day; the member's own calendar by default, a venue's calendar when given. */
  mark?: (date: string, status: CalendarStatus | null) => Promise<MutationResult>;
}) {
  const [status, setStatus] = useState<Record<string, CalendarStatus>>(
    () => Object.fromEntries(marked.map((day) => [day.date, day.status])),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function press(date: string) {
    const current = stateOf(status, date);
    const next = NEXT[current];
    setError(null);
    // Show the new state at once; put the old one back if the server refuses.
    setStatus((all) => {
      const copy = { ...all };
      if (next) copy[date] = next;
      else delete copy[date];
      return copy;
    });
    startTransition(async () => {
      const result = await mark(date, next);
      if (!result.ok) {
        setError(result.message);
        setStatus((all) => {
          const copy = { ...all };
          if (current === "UNSET") delete copy[date];
          else copy[date] = current;
          return copy;
        });
      }
    });
  }

  return (
    <>
      <ul className="days days--editable" aria-busy={pending}>
        {Array.from({ length: days }, (_, index) => {
          const date = addDays(from, index);
          const state = stateOf(status, date);
          return (
            <li key={date}>
              <button
                type="button"
                className={`day day--${state === "UNSET" ? "unknown" : state.toLowerCase()}`}
                onClick={() => press(date)}
              >
                {jalali(date)}
                <span className="day__state">{TEXT[state]}</span>
              </button>
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
