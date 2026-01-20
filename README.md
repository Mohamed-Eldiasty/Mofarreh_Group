# Mofarreh Group — Next.js Prototype

ملخّص:
هذا فرع تجريبي يحتوي على prototype مبسّط لـ Next.js مع NextAuth وIntegration مع Supabase لتخزين الوسائط.

إعداد محلي سريع:
1. انسخ الريبو وادخل الفرع `dev`.
2. أنشئ ملف `.env.local` بقيم (أنظر `.env.example`):
```
NEXTAUTH_SECRET=some_secret_value
ADMIN_EMAILS=admin@example.com
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
```
3. npm install
4. npm run dev
5. فتح http://localhost:3000

إعداد Supabase سريع:
- أنشئ مشروع في https://app.supabase.com
- من قائمة Storage أنشئ bucket باسم `public`، وجعله public (أو اضبط سياسات الوصول كما ترغب)
- ضع قيم NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في ملف .env.local أو في إعدادات Vercel

ملاحظات:
- أضفت Tailwind CSS وMedia Manager للتجربة. سنستكمل محرر WYSIWYG، CRUD للمحتوى، وتحسينات الأمان في المراحل التالية.
