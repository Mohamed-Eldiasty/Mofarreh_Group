# Mofarreh Group — Next.js Prototype

ملخّص:
هذا فرع تجريبي يحتوي على prototype مبسّط لـ Next.js مع NextAuth. الغرض: توفير بنية أولية للوحة إدارة ومصادقة Admin.

إعداد محلي سريع:
1. انسخ الريبو وادخل الفرع `dev`.
2. أنشئ ملف `.env.local` بقيم:
```
NEXTAUTH_SECRET=some_secret_value
ADMIN_EMAILS=admin@example.com
ADMIN_PASSWORD=your_admin_password
```
3. npm install
4. npm run dev
5. فتح http://localhost:3000

ملاحظات:
- هذه نسخة Prototype بسيطة — المصادقة هنا تعتمد على بيانات ثابتة في env لتسريع العرض. سنستبدلها لاحقاً بقاعدة مستخدمين حقيقية (DB أو OAuth/Supabase).
- بعد موافقتك، سأكمل: إضافة Tailwind، Media Manager، محرر WYSIWYG، واجهات CRUD، ورفع الملفات إلى S3/Supabase.
