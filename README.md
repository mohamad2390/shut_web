# SHUT web

وب‌اپ SHUT؛ کنار ربات تلگرام و روی همون API بک‌اند. Next.js (App Router) + TypeScript، راست‌به‌چپ، فونت وزیرمتن.

## اجرا

```bash
npm install
cp .env.example .env.local      # آدرس بک‌اند (پیش‌فرض http://localhost:8080)
npm run dev                     # http://localhost:3000
npm run typecheck && npm run build
```

بک‌اند (Spring Boot) باید بالا باشه و `telegram.bot.enabled=true` باشه تا عکس‌ها نشون داده بشن.

## چطور وصل می‌شه

- صفحه‌ها (سمت سرور) مستقیم از `API_URL` می‌خونن.
- مرورگر فقط به همین سایت درخواست می‌ده؛ `next.config.mjs` مسیر `/api/*` رو به بک‌اند می‌فرسته. پس CORS لازم نیست و توکن ربات هیچ‌وقت به مرورگر نمی‌رسه.
- تایپ‌های API توی `src/lib/types.ts` و فراخوانی‌ها توی `src/lib/api.ts` هستن.

## صفحه‌ها

- `/` — فهرست متخصص‌ها، جستجو (`?q=`) و صفحه‌بندی (`?page=`، از ۰).
- `/providers/{id}` — پروفایل، تجهیزات، تماس و نمونه‌کار با بخش‌ها (`?category=`).

## قدم‌های بعدی

مکان‌های عکاسی (`/venues`)، ورود با OTP، رزرو، پروفایل و تقویم من.
