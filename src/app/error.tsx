"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="hero">
      <h1>اتصال به سرور برقرار نشد</h1>
      <p>چند لحظه‌ی دیگه دوباره امتحان کن.</p>
      <button type="button" onClick={reset} className="button">
        تلاش دوباره
      </button>
    </section>
  );
}
