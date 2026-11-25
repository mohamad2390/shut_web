"use client";

import { useEffect, useState, useTransition } from "react";
import { requestCodeAction, verifyCodeAction } from "@/app/login/actions";
import { fa } from "@/lib/format";

/** The code can be asked for again after this many seconds; the backend enforces the same minute. */
const RESEND_SECONDS = 60;

export function LoginForm({ next }: { next: string }) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function sendCode() {
    setError(null);
    startTransition(async () => {
      const result = await requestCodeAction(phone);
      if (result.ok) {
        setStep("code");
        setCode("");
        setCooldown(RESEND_SECONDS);
      } else {
        setError(result.message);
      }
    });
  }

  function checkCode() {
    setError(null);
    startTransition(async () => {
      // On success the action redirects, so only a failure comes back here.
      const result = await verifyCodeAction(phone, code, next);
      if (result && !result.ok) setError(result.message);
    });
  }

  return (
    <form
      className="login"
      onSubmit={(event) => {
        event.preventDefault();
        if (step === "phone") sendCode();
        else checkCode();
      }}
    >
      {step === "phone" ? (
        <>
          <label htmlFor="phone">شماره‌ی موبایل</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="09123456789"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            autoFocus
          />
          <p className="hint">یک کد ۶ رقمی پیامک می‌کنیم. لازم نیست عضو کانال باشی.</p>
          <button type="submit" disabled={pending || phone.trim() === ""}>
            {pending ? "در حال ارسال…" : "ارسال کد"}
          </button>
        </>
      ) : (
        <>
          <label htmlFor="code">کد پیامک‌شده</label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
            autoFocus
          />
          <p className="hint">کد به شماره‌ی {phone} رفت.</p>
          <button type="submit" disabled={pending || code.trim().length < 6}>
            {pending ? "در حال بررسی…" : "ورود"}
          </button>
          <div className="login__links">
            <button type="button" className="link-button" onClick={sendCode} disabled={pending || cooldown > 0}>
              {cooldown > 0 ? `کد جدید تا ${fa(cooldown)} ثانیه‌ی دیگه` : "ارسال دوباره‌ی کد"}
            </button>
            <button type="button" className="link-button" onClick={() => setStep("phone")} disabled={pending}>
              تغییر شماره
            </button>
          </div>
        </>
      )}
      {error && (
        <p role="alert" className="login__error">
          {error}
        </p>
      )}
    </form>
  );
}
