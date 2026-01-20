import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminToolbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  if (!isAdmin) return null;

  return (
    <div style={{ marginTop: 16, padding: 12, border: '1px solid #ccc', background: '#f9f9f9' }}>
      <strong>أدوات الإدارة:</strong>
      <div style={{ marginTop: 8 }}>
        <Link href="/admin"><button>لوحة التحكم</button></Link>
        <button style={{ marginLeft: 8 }}>رفع مباشر (Prototype)</button>
      </div>
    </div>
  );
}