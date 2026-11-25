import type { Metadata } from "next";
import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { authedGet, isAdmin } from "@/lib/backend";
import { fa, maskPhone } from "@/lib/format";
import type { MyProfile, MyShowcase } from "@/lib/types";

export const metadata: Metadata = { title: "حساب من" };

export default async function MePage() {
  const me = await requireMe("/me");
  const [profile, showcase, admin] = await Promise.all([
    authedGet<MyProfile>("/api/v1/me/profile"),
    authedGet<MyShowcase>("/api/v1/me/showcase"),
    isAdmin(),
  ]);

  return (
    <>
      <section className="hero">
        <h1>{profile.displayName ?? me.displayName ?? "حساب من"}</h1>
        {me.phone && <p className="hint">شماره‌ی ورود: {maskPhone(me.phone)}</p>}
      </section>

      <ul className="grid">
        <li className="card">
          <Link href="/me/profile" className="card__link">
            <h2 className="card__name">پروفایل</h2>
            <p className="card__city">
              {profile.registered
                ? "اطلاعات متخصصی‌ات رو ببین و ویرایش کن."
                : "برای دیده شدن توی فهرست متخصص‌ها، پروفایلت رو بساز."}
            </p>
          </Link>
        </li>

        {profile.registered ? (
          <>
            <li className="card">
              <Link href="/me/calendar" className="card__link">
                <h2 className="card__name">تقویم</h2>
                <p className="card__city">روزهای آزاد و پرت رو مشخص کن.</p>
              </Link>
            </li>
            <li className="card">
              <Link href="/me/pricing" className="card__link">
                <h2 className="card__name">تعرفه‌ها</h2>
                <p className="card__city">قیمت خدماتت رو بنویس و عوض کن.</p>
              </Link>
            </li>
          </>
        ) : (
          <li className="card card--muted">
            <div className="card__link">
              <h2 className="card__name">تقویم و تعرفه‌ها</h2>
              <p className="card__city">بعد از ساختن پروفایل باز می‌شن.</p>
            </div>
          </li>
        )}

        {admin && (
          <li className="card">
            <Link href="/admin" className="card__link">
              <h2 className="card__name">پنل ادمین</h2>
              <p className="card__city">کاربران، مکان‌ها، خدمت‌ها و واحدها.</p>
            </Link>
          </li>
        )}
        <li className="card">
          <Link href="/me/venues" className="card__link">
            <h2 className="card__name">مکان‌های من</h2>
            <p className="card__city">استودیو و مکان عکاسی‌ات، قیمت‌ها، تقویم و درخواست‌های رزرو.</p>
          </Link>
        </li>
        <li className="card">
          <Link href="/me/listings" className="card__link">
            <h2 className="card__name">آگهی‌های من</h2>
            <p className="card__city">تجهیزاتی که می‌فروشی و پیشنهادهای خریدارها.</p>
          </Link>
        </li>
        <li className="card">
          <Link href="/me/offers" className="card__link">
            <h2 className="card__name">پیشنهادهای من</h2>
            <p className="card__city">پیشنهادهایی که برای خرید دادی.</p>
          </Link>
        </li>
        <li className="card">
          <Link href="/me/bookings" className="card__link">
            <h2 className="card__name">درخواست‌های رزرو من</h2>
            <p className="card__city">جواب مالک‌ها به درخواست‌هایی که فرستادی.</p>
          </Link>
        </li>

        <li className="card">
          <div className="card__link">
            <h2 className="card__name">ویترین</h2>
            <p className="card__city">
              {showcase.total > 0 ? `${fa(showcase.total)} نمونه‌کار داری.` : "هنوز نمونه‌کاری نداری."}
            </p>
            {showcase.categories.length > 0 && (
              <ul className="chips">
                {showcase.categories.map((entry) => (
                  <li key={entry.category.key}>
                    {entry.category.label} ({fa(entry.count)})
                  </li>
                ))}
              </ul>
            )}
            <p className="hint">عکس و ویدیوی ویترین فقط از ربات تلگرام اضافه می‌شه.</p>
            {showcase.botUrl && (
              <a className="button" href={showcase.botUrl} rel="noopener noreferrer">
                تکمیل ویترین در ربات
              </a>
            )}
          </div>
        </li>
      </ul>

      {!me.telegramLinked && (
        <p className="notice">
          حساب وبت هنوز به تلگرام وصل نیست. برای تکمیل ویترین، توی ربات «اطلاعات من ← 📱 شماره‌ی موبایل» رو بزن و
          همین شماره‌ای که با اون وارد شدی رو بفرست؛ بعدش حساب‌ها یکی می‌شن.
        </p>
      )}
    </>
  );
}
