import ImprovedReviewerDashboard from '@/components/ImprovedReviewerDashboard'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

export default function ReviewerDashboard() {
  return (
    <AuthenticatedLayout>
      <ImprovedReviewerDashboard />
    </AuthenticatedLayout>
  );
}
