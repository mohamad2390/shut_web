"use client";

import { setUserActiveAction } from "@/app/admin/actions";
import { ActiveToggle } from "@/components/ActiveToggle";
import { faDigits } from "@/lib/format";
import type { AdminUser } from "@/lib/types";

export function AdminUserRow({ user }: { user: AdminUser }) {
  return (
    <li className="price-menu__row">
      <span className="price-menu__name">
        {user.name ?? "بدون نام"}
        {!user.active && " (مسدود)"}
        {user.roles.includes("PROVIDER") && <span className="hint"> متخصص</span>}
      </span>
      <span className="price-menu__amount">
        <span dir="ltr">{user.phone ? faDigits(user.phone) : "بدون شماره"}</span>
        {user.telegramUsername && <span className="hint"> @{user.telegramUsername}</span>}
        {!user.telegramLinked && <span className="hint"> فقط وب</span>}
      </span>
      <span className="price-menu__actions">
        <ActiveToggle
          active={user.active}
          onLabel="مسدود کن"
          offLabel="آزاد کن"
          confirmOff="این حساب مسدود بشه؟ ورودش تموم می‌شه و از فهرست متخصص‌ها می‌افته."
          action={(active) => setUserActiveAction(user.id, active)}
        />
      </span>
    </li>
  );
}
