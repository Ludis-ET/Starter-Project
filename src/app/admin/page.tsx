import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { fetchAnalytics, fetchUsers, fetchCycles } from '@/lib/admin-api';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';

export default async function AdminPage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/Signin');
  }

  // Define role-specific redirect URLs
  const roleRedirects: { [key: string]: string } = {
    admin: '/admin',
    manager: '/manager',
    reviewer: '/reviewer',
    applicant: '/applicant',
  };

  // Get the user's role, default to 'applicant'
  const role = session.user?.role || 'applicant';
  const redirectUrl = roleRedirects[role] || '/applicant';

  // Redirect unauthorized users
  if (role !== 'admin') {
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" userName={session.user?.email} />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {session.user?.email || 'Admin'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Statistics */}
          <DashboardStats />

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manage Users */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
              <p className="text-gray-600 mb-4">Create, edit, and manage user accounts and permissions.</p>
              <Link
                href="/admin/users"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Go to Users →
              </Link>
            </div>

            {/* Manage Cycles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Cycles</h3>
              <p className="text-gray-600 mb-4">Create and manage application cycles.</p>
              <Link
                href="/admin/cycles"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Go to Cycles →
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Admin Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">New user Jane Doe created</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Cycle "Q1 2024" set to active</span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
              <p className="text-gray-600 mb-4">Explore application data and platform insights.</p>
              <Link
                href="/admin/analytics"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                Go to Analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
