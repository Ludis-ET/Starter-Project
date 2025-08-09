import { fetchAnalytics, fetchCycles } from '@/lib/admin-api';

interface DashboardData {
  accepted: number;
  totalApplications: number;
  pendingReviews: number;
  acceptanceRate: number;
  averageReviewTime: number;
}

interface DashboardStatsProps {
  cycleId: string; // we’ll filter cycles using this
}

export default async function DashboardStats({ cycleId }: DashboardStatsProps) {
  // Fetch analytics
  const analyticsResponse = await fetchAnalytics();
  const analytics = analyticsResponse.data;
  console.log('Analytics Data:', analytics);
  const data: DashboardData = {
    accepted: analytics?.application_funnel.accepted || 0,
    totalApplications: analytics?.total_applicants || 0,
    pendingReviews: analytics?.application_funnel.pending_review || 0,
    acceptanceRate: analytics?.acceptance_rate || 0,
    averageReviewTime: analytics?.average_review_time_days || 0,
  };

  // Fetch cycles and filter by ID
  const cyclesResponse = await fetchCycles();
  const cycles = Array.isArray(cyclesResponse?.data.cycles)
  ? cyclesResponse.data.cycles
  : Array.isArray(cyclesResponse?.data?.cycles)
  ? cyclesResponse.data.cycles
  : [];

const selectedCycle = cycles.find(
  (cycle: any) => cycle.is_active === true
);
  const stats = [
    {
      title: 'Accepted Reviews',
      value: data.accepted.toLocaleString(),
      change: '+12%',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Applications',
      value: data.totalApplications.toLocaleString(),
      change: '+23%',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Pending Reviews',
      value: data.pendingReviews.toString(),
      change: '+5%',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <>
      <div className="mb-6">
        {selectedCycle ? (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold">Current Cycle</h2>
            <p>Name: {selectedCycle.name}</p>
          </div>
        ) : (
          <p className="text-gray-500">No cycle found for ID {cycleId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.gradient} text-white rounded-lg p-6 shadow-lg`}
          >
            <p className="text-sm text-white/80 font-medium">{stat.title}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
            <div className="flex items-center mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                {stat.change}
              </span>
              <span className="text-xs text-white/80 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
