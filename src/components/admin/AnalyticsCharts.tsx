"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface AnalyticsChartsProps {
  analyticsData: {
    total_applicants: number;
    acceptance_rate: number;
    average_review_time_days: number;
    application_funnel: Record<string, number>;
    school_distribution: Record<string, number>;
    country_distribution: Record<string, number>;
  } | null;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function AnalyticsCharts({ analyticsData }: AnalyticsChartsProps) {
  if (!analyticsData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 h-80">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Transform data for charts
  const funnelData = analyticsData.application_funnel ? 
    Object.entries(analyticsData.application_funnel).map(([stage, count]) => ({
      stage: stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: Math.round((count / analyticsData.total_applicants) * 100)
    })) : [];

  const schoolData = analyticsData.school_distribution ?
    Object.entries(analyticsData.school_distribution).map(([school, count]) => ({
      name: school,
      value: count
    })) : [];

  const countryData = analyticsData.country_distribution ?
    Object.entries(analyticsData.country_distribution).map(([country, count]) => ({
      country,
      applicants: count
    })) : [];

  // Mock time series data for review trends
  const reviewTrendsData = [
    { month: 'Jan', avgTime: 3.2, applications: 120 },
    { month: 'Feb', avgTime: 2.8, applications: 180 },
    { month: 'Mar', avgTime: 3.5, applications: 220 },
    { month: 'Apr', avgTime: 2.9, applications: 190 },
    { month: 'May', avgTime: 3.1, applications: 250 },
    { month: 'Jun', avgTime: 2.6, applications: 300 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Application Funnel Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Funnel</h3>
        <p className="text-sm text-gray-600 mb-6">Applicant journey from submission to acceptance</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="stage" 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* University Distribution Pie Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">University Distribution</h3>
        <p className="text-sm text-gray-600 mb-6">Breakdown of applicants by university</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={schoolData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {schoolData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Review Time Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Time Trends</h3>
        <p className="text-sm text-gray-600 mb-6">Average review time over the past 6 months</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={reviewTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="avgTime" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <p className="text-sm text-gray-600 mb-6">Number of applicants by country</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={countryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="country" 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="applicants" 
              stroke="#10B981" 
              fill="#10B981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
