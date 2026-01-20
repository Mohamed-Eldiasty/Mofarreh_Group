import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import AdminToolbar from '../components/AdminToolbar';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main style={{ padding: 24, direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      <h1>مرحبا بك في موقع المجموعة</h1>
      <p>هذا المحتوى متاح لكل الزوار. يمكن للمسجلين الدخول التفاعل، وللمشرفين إجراء تعديلات.</p>

      <div style={{ marginTop: 16 }}>
        {session ? (
          <>
            <div>مرحباً، {session.user?.email}</div>
            <button onClick={() => signOut()}>تسجيل خروج</button>
          </>
        ) : (
          <button onClick={() => signIn()}>تسجيل / تسجيل دخول</button>
        )}
      </div>

      <AdminToolbar />
      <section style={{ marginTop: 24 }}>
        <h2>أمثلة على محتوى</h2>
        <p>محتوى الموقع الظاهر للعامة — هنا يمكنك عرض الأخبار، الفعاليات، المنتجات...</p>
      </section>

      <div style={{ marginTop: 12 }}>
        <Link href="/admin">انتقل إلى لوحة الإدارة (مؤمّنة)</Link>
      </div>
    </main>
  );
}