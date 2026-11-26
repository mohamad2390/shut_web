import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { getMe } from "@/lib/auth";
import { maskPhone } from "@/lib/format";

export async function SiteHeader() {
  const me = await getMe();
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link href="/" className="brand" aria-label="SHUT، صفحه‌ی اصلی">
          SHUT
        </Link>
        <nav aria-label="بخش‌ها" className="site-nav">
          <Link href="/">متخصص‌ها</Link>
          <Link href="/venues">مکان‌های عکاسی</Link>
          <Link href="/studios">استودیوها</Link>
          <Link href="/rental">اجاره‌ی تجهیزات</Link>
          <Link href="/market">بازار تجهیزات</Link>
        </nav>
        {me ? (
          <form action={logoutAction} className="account">
            <Link href="/me" className="account__name">
              {me.displayName ?? (me.phone ? maskPhone(me.phone) : "حساب من")}
            </Link>
            <button type="submit" className="link-button">
              خروج
            </button>
          </form>
        ) : (
          <Link href="/login" className="account__login">
            ورود
          </Link>
        )}
      </div>
    </header>
  );
}
