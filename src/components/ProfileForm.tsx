"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProfileAction, type ProfileFormState } from "@/app/me/actions";
import type { MyProfile } from "@/lib/types";

const idle: ProfileFormState = { status: "idle" };

function lines(items: string[]): string {
  return items.join("\n");
}

export function ProfileForm({ profile }: { profile: MyProfile }) {
  const [state, action, pending] = useActionState(saveProfileAction, idle);

  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="displayName">نام نمایشی *</label>
        <input id="displayName" name="displayName" defaultValue={profile.displayName ?? ""} maxLength={150} required />
        <p className="hint">همین نام توی فهرست متخصص‌ها دیده می‌شه.</p>
      </div>

      <div className="field">
        <label htmlFor="headline">عنوان کوتاه</label>
        <input id="headline" name="headline" defaultValue={profile.headline ?? ""} maxLength={180}
          placeholder="مثلاً: عکاس عروسی و پرتره" />
      </div>

      <div className="field">
        <label htmlFor="bio">درباره‌ی من</label>
        <textarea id="bio" name="bio" rows={5} defaultValue={profile.bio ?? ""} maxLength={5000} />
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="yearsExperience">سال‌های سابقه</label>
          <input id="yearsExperience" name="yearsExperience" type="number" min={0} max={80} inputMode="numeric"
            defaultValue={profile.yearsExperience ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="baseCity">شهر</label>
          <input id="baseCity" name="baseCity" defaultValue={profile.baseCity ?? ""} maxLength={100} />
        </div>
        <div className="field">
          <label htmlFor="baseCountry">کشور</label>
          <input id="baseCountry" name="baseCountry" defaultValue={profile.baseCountry ?? ""} maxLength={100} />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="instagramUsername">اینستاگرام</label>
          <input id="instagramUsername" name="instagramUsername" dir="ltr" defaultValue={profile.instagramUsername ?? ""}
            maxLength={100} placeholder="username" />
        </div>
        <div className="field">
          <label htmlFor="websiteUrl">وب‌سایت</label>
          <input id="websiteUrl" name="websiteUrl" dir="ltr" defaultValue={profile.websiteUrl ?? ""} maxLength={500}
            placeholder="example.com" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="skills">مهارت‌ها</label>
        <textarea id="skills" name="skills" rows={3} defaultValue={lines(profile.skills)} />
        <p className="hint">هر مهارت توی یک خط، یا با ویرگول جدا کن.</p>
      </div>

      <div className="field">
        <label htmlFor="serviceCities">شهرهای خدمت</label>
        <textarea id="serviceCities" name="serviceCities" rows={2} defaultValue={lines(profile.serviceCities)} />
      </div>

      <div className="field">
        <label htmlFor="collaborators">همکاری با (افراد و استودیوها)</label>
        <textarea id="collaborators" name="collaborators" rows={2} defaultValue={lines(profile.collaborators)} />
      </div>

      <div className="field">
        <label htmlFor="equipmentDescription">توضیح تجهیزات</label>
        <textarea id="equipmentDescription" name="equipmentDescription" rows={3}
          defaultValue={profile.equipmentDescription ?? ""} maxLength={3000} />
        <p className="hint">فهرست دقیق دوربین و لنز رو از ربات تلگرام ثبت می‌کنی.</p>
      </div>

      <button type="submit" className="button" disabled={pending}>
        {pending ? "در حال ذخیره…" : profile.registered ? "ذخیره‌ی تغییرات" : "ثبت پروفایل متخصص"}
      </button>

      {state.status === "saved" && (
        <p role="status" className="form__ok">
          ذخیره شد. <Link href="/me">برگشت به حساب من</Link>
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
