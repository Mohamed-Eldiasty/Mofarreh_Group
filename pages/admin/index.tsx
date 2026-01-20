import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export default function AdminDashboard() {
  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h1>لوحة الإدارة (Prototype)</h1>
      <p>هنا نضع أدوات الـ CRUD، محرر WYSIWYG، ومنظّم الملفات لاحقاً.</p>
      <p>هذا المثال يوضح الولوج الآمن فقط.</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session || !session.user?.isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  return { props: {} };
};