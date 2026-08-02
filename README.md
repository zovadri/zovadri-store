# Zovadri — بنبني مشروعك البرمجي

موقع لطلب المشاريع البرمجية: هيرو تعريفي، خدمات، بورتفوليو مع عروض تجريبية حية (20 ديمو تفاعلي)، نموذج طلب يفتح واتساب مباشرة، ولوحة تحكم كاملة للإدارة.

## البنية

- **Next.js 15** (App Router + RTL عربي) — `apps/web` — http://localhost:3000
- **Express 5 + TypeScript** — `apps/api` — http://localhost:4000
- **PostgreSQL 17 + Prisma** — `packages/db` — قاعدة `zovadri` على `localhost:5432` (بدون باسورد، trust)

## الحساب الافتراضي للأدمن

- الإيميل: `admin@zovadri.com`
- كلمة السر: `Admin@123`

أي حساب جديد يُسجّل من `/register` بيبقى أدمن تلقائياً (يعتبر مالك الموقع).

## التشغيل

```bash
# 1) شغّل قاعدة البيانات (PostgreSQL في C:\pg17)
C:\pg17\pgsql\bin\pg_ctl -D C:\pg17\data start

# 2) توليد Prisma Client (بعد أي تعديل في schema)
npm run db:generate

# 3) مزامنة القاعدة (بدون مسح البيانات)
npm run db:push

# 4) تجهيز البيانات أساسية (أدمن + إعدادات)
npm run db:seed
npx tsx scripts/seed-portfolio.ts   # يمسح العمل ويعبد 20 مشروع بالروابط التجريبية

# 5) التشغيل
npm run start --workspace=apps/api   # http://localhost:4000
npm run start --workspace=apps/web   # http://localhost:3000
```

## أوامر الـ Prisma مخصصة (root package.json)

- `db:generate` — توليد العميل الجديد
- `db:push` — مزامنة schema مع القاعدة (بدون مسح)
- `db:reset` — `db push --force-reset` (يمسح كل البيانات)
- `db:seed` — بإعادة إنشاء الأدمن والإعدادات فقط (لا يمسح الطلبات)

## الديموهات

- المكونات: `apps/web/components/demos/` (شائعة + بوتات + تطبيقات + ويب)
- السجل: `apps/web/components/demos/index.tsx` يربط كل slug بمكوّن
- الصفحة: `apps/web/app/demo/[slug]/page.tsx`
- مشروع بورتفوليو فيه `link` (مثل `/demo/store`) يظهر عليه زرار "⚡ جرّب المشروع حي الآن"

## الـ API

| المسار | الوصف |
| --- | --- |
| `GET /api/site` | إعدادات الموقع العامة (واتساب/فيسبوك/الوصف) |
| `GET /api/portfolio` | قائمة الأعمال (عام) |
| `POST /api/orders` | إرسال طلب مشروع (عام) |
| `POST /api/auth/register` | إنشاء حساب (بيبقى أدمن) |
| `POST /api/auth/login` | دخول ويرجع JWT |
| `GET /api/auth/me` | بيانات المستخدم الحالي |
| `GET /api/admin/dashboard` | إحصائيات |
| `GET/PATCH/DELETE /api/admin/orders` | إدارة الطلبات |
| `GET/POST/PATCH/DELETE /api/admin/portfolio` | إدارة الأعمال |
| `GET/PUT /api/admin/settings` | تعديل الإعدادات |