import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/ProfileForm";
import { requireMe } from "@/lib/auth";
import { authedGet } from "@/lib/backend";
import type { MyProfile } from "@/lib/types";

export const metadata: Metadata = { title: "پروفایل من" };

export default async function MyProfilePage() {
  await requireMe("/me/profile");
  const profile = await authedGet<MyProfile>("/api/v1/me/profile");

  return (
    <>
      <p className="back">
        <Link href="/me">← حساب من</Link>
      </p>
      <section className="hero">
        <h1>{profile.registered ? "پروفایل من" : "ساختن پروفایل متخصص"}</h1>
        {!profile.registered && <p>با ثبت پروفایل، توی فهرست متخصص‌ها دیده می‌شی و تقویم و تعرفه‌ات باز می‌شه.</p>}
      </section>
      <ProfileForm profile={profile} />
    </>
  );
}
