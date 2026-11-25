"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "@/lib/types";

/** A button that switches something on or off and says why when it cannot. */
export function ActiveToggle({
  active,
  onLabel,
  offLabel,
  confirmOff,
  action,
}: {
  active: boolean;
  /** Shown while it is on: the button turns it off, e.g. «مسدود کن» */
  onLabel: string;
  /** Shown while it is off, e.g. «آزاد کن» */
  offLabel: string;
  /** Asked before turning it off */
  confirmOff?: string;
  action: (active: boolean) => Promise<MutationResult>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        className="link-button"
        disabled={pending}
        onClick={() => {
          if (active && confirmOff && !window.confirm(confirmOff)) return;
          setError(null);
          startTransition(async () => {
            const result = await action(!active);
            if (!result.ok) setError(result.message);
          });
        }}
      >
        {active ? onLabel : offLabel}
      </button>
      {error && (
        <span role="alert" className="form__error">
          {" "}
          {error}
        </span>
      )}
    </>
  );
}
