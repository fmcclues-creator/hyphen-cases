# HYPHEN Cases — متجر الرموز

موقع صغير يبيع رموز الفرق للعبة «قضية خالد» ويتحقق منها.

## الصفحات
- `/` الصفحة الرئيسية
- `/buy` شراء رمز (KNET/بطاقة عبر MyFatoorah، أو وضع تجربة)
- `/buy/done` عرض الرمز بعد الدفع
- `/play` إدخال رمز موجود والانتقال للعبة
- `/admin` توليد رموز للفعاليات (محمي بكلمة سر)
- `/api/verify` اللعبة تتحقق من الرمز هنا

## التشغيل (مرة واحدة)
1. **Supabase**: أنشئ مشروعاً، ثم SQL Editor → الصق `supabase/schema.sql` → Run.
2. **Vercel**: New Project → Import هذا المجلد (ارفعه على GitHub أو استخدم `vercel` CLI).
3. في Vercel → Settings → Environment Variables، أضف المتغيرات من `.env.example`:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` من Supabase → Project Settings → API
   - `ADMIN_PASSWORD` أي كلمة سر قوية
   - `NEXT_PUBLIC_GAME_URL` رابط اللعبة
   - `PRICE_KWD` السعر
   - `PAYMENT_MODE=test` حتى تُعتمد بوابة الدفع، ثم `myfatoorah` مع `MYFATOORAH_API_KEY`
   - `SITE_URL` رابط الموقع بعد النشر
4. Deploy. ثم Settings → Domains → أضف `cases.hyphen-eventskw.com` واتبع تعليمات DNS.
5. في ملف اللعبة، تأكد أن `STORE` يساوي رابط الموقع، و`GATE_ON=true`.
