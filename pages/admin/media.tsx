import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
const MediaManager = dynamic(() => import('../../components/MediaManager'), { ssr: false });

export default function AdminMedia() {
  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h1>رفع وإدارة الملفات</h1>
      <MediaManager />
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