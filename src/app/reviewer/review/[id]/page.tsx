import ApplicationReviewDetail from '@/components/ApplicationReviewDetail';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AuthenticatedLayout>
      <ApplicationReviewDetail applicationId={id} />
    </AuthenticatedLayout>
  );
}
