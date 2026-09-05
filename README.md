# DiscoverStans — Travel Agency Frontend

O'zbekiston va Markaziy Osiyo bo'ylab sayohat turlarini taqdim etuvchi
[DiscoverStans](https://www.discover-stans.uz)
[Next.js](https://nextjs.org) (App Router) va TypeScript'da qurilgan.

## Texnologiyalar

- **Framework:** Next.js (App Router, Server Components)
- **Til:** TypeScript
- **Stil:** Tailwind CSS + shadcn/ui komponentlari
- **Ko'p tillilik (i18n):** `next-i18next` — `uz`, `ru`, `en` tillari qo'llab-quvvatlanadi (standart til: `en`, prefiksisiz)
- **Formalar:** `react-hook-form` + `zod`
- **HTTP so'rovlar:** `axios`
- **Bildirishnomalar:** `sonner`
- **Ikonkalar:** `lucide-react`, `@hugeicons/react`
- **Navigatsiya indikatori:** `nextjs-toploader`

## Loyihani ishga tushirish

### Talablar

- Node.js 18+ (tavsiya: 20+)
- npm (yoki yarn/pnpm/bun)

### O'rnatish

\`\`\`bash
npm install
\`\`\`

### Muhit o'zgaruvchilari

Loyiha ildizida `.env.local` fayl yarating:

\`\`\`bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
\`\`\`

Bu — backend API manzili (masalan Render.com'dagi FastAPI/Express server). Barcha
`fetch`/`axios` so'rovlari shu manzilga yuboriladi.

> ⚠️ Agar backend Render.com'ning bepul tarifida bo'lsa, u 15 daqiqa
> faoliyatsizlikdan keyin "uxlab qoladi" va birinchi so'rov 30-60 soniya
> davom etishi mumkin (cold start). Buni yumshatish uchun frontend'da
> `hooks/use-fetch.ts` avtomatik qayta urinish (retry) mexanizmini o'z ichiga oladi.

### Development rejimida ishga tushirish

\`\`\`bash
npm run dev
\`\`\`

[http://localhost:3000](http://localhost:3000) manzilida ochiladi.

### Production uchun build

\`\`\`bash
npm run build
npm run start
\`\`\`

### Lint

\`\`\`bash
npm run lint
\`\`\`

## Loyiha strukturasi

\`\`\`
app/
  [lng]/                    # Til prefiksli barcha sahifalar (uz, ru, en)
    (main)/                 # Asosiy sayt: bosh sahifa, about, tours, contact...
      about/
      contact/
      services/
      tours/
        [slug]/              # Bitta tur haqida batafsil sahifa
      login/
      profile/
    admin/                   # Admin panel (turlar, buyurtmalar, foydalanuvchilar...)
      bookings/
      geography/
      messages/
      reviews/
      settings/
      tours/
      users/
  not-found.tsx              # Global 404 sahifa

components/
  layout/                    # Header, Footer
  sections/                  # Bosh sahifadagi bloklar (Hero, Destinations, PopularTours...)
  tours/                     # Tur kartochkasi, filtrlar, sharhlar
  services/
  admin/                     # Admin panel komponentlari
  ui/                        # shadcn/ui asosidagi umumiy UI komponentlari
  _components/                # Umumiy error/loading komponentlari

hooks/
  use-fetch.ts                # Ma'lumot olish + avtomatik retry (cold start uchun)
  use-localized-href.ts       # Ichki havolalarga to'g'ri til prefiksini qo'shish

lib/
  api.ts                      # Backend bilan aloqa (axios instance + interceptorlar)
  utils.ts                    # Umumiy yordamchi funksiyalar (localizedHref, metaT...)
  site-config.ts               # Sayt/kompaniya ma'lumotlari (aloqa, manzil va h.k.)

contexts/
  AuthContext.tsx             # Foydalanuvchi autentifikatsiyasi holati

public/
  locales/                    # Tarjima fayllari
    en/  ru/  uz/
\`\`\`

## Ko'p tillilik (i18n)

- Qo'llab-quvvatlanadigan tillar: `uz`, `ru`, `en` (`i18n.config.ts`)
- Standart til (`en`) URL'da prefikssiz ko'rinadi (`hideDefaultLocale: true`):
  - `/tours` → ingliz tilida
  - `/uz/tours` → o'zbek tilida
  - `/ru/tours` → rus tilida
- Tarjima fayllari `public/locales/{til}/{namespace}.json` ko'rinishida
- **Ichki havolalar** (`<Link href="...">`) yozayotganda tilni saqlab qolish uchun:
  - Server componentlarda: `localizedHref(lng, "/tours")` (`lib/utils.ts`)
  - Client componentlarda: `useLocalizedHref()` hook (`hooks/use-localized-href.ts`)
  - Hech qachon `href="/tours"` kabi tilsiz qattiq yozilgan yo'l ishlatilmasin —
    bu foydalanuvchini har doim standart (`en`) tilga olib ketadi

## Backend bilan aloqa

Barcha so'rovlar `lib/api.ts`dagi markazlashtirilgan `axios` instance orqali
yuboriladi. `hooks/use-fetch.ts` esa ma'lumot olishning umumiy patternini
(`isLoading`, `isRetrying`, `error`) taqdim etadi — backend sekin javob bersa
(masalan Render cold start), foydalanuvchiga "server uyg'onmoqda" degan xabar
avtomatik ko'rsatiladi va so'rov qayta uriniladi.

## Deploy

Loyiha Vercel, Render yoki boshqa Next.js'ni qo'llab-quvvatlaydigan istalgan
platformaga joylashtirilishi mumkin. Muhim: `NEXT_PUBLIC_API_URL` muhit
o'zgaruvchisini deploy platformasida ham sozlashni unutmang.