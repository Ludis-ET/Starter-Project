import ProfilePage from '@/components/ProfilePage';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

export default function Profile() {
  return (
    <AuthenticatedLayout>
      <ProfilePage />
    </AuthenticatedLayout>
  );
}
