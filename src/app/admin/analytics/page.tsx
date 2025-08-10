import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { fetchAnalytics } from '@/lib/admin-api';
import AdminHeader from '@/components/admin/AdminHeader';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

export default async function AnalyticsPage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/signin');
  }

  // Check if user is admin
  if ((session.user as any)?.role !== 'admin') {
    redirect('/');
  }

  let analyticsData;
  let error = null;

  try {
    const response = await fetchAnalytics();
    analyticsData = response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch analytics';
    console.error('Analytics fetch error:', err);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader userRole="Admin User" />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Application Analytics</h1>
              <p className="text-gray-600 mt-2">Insights for the Q4 recruitment intake</p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Analytics</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Application Analytics</h1>
            <p className="text-gray-600 mt-2">Insights for the Q4 recruitment intake</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.total_applicants?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.acceptance_rate ? `${analyticsData.acceptance_rate.toFixed(1)}%` : '0%'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Review Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.average_review_time_days ? `${analyticsData.average_review_time_days} Days` : '0 Days'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <AnalyticsCharts analyticsData={analyticsData || null} />
        </div>
      </div>
    </div>
  );
}
