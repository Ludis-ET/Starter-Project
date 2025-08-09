import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { fetchCycles } from '@/lib/admin-api';
import AdminHeader from '@/components/admin/AdminHeader';
import CycleCard from '@/components/admin/CycleCard';
import Link from 'next/link';

export default async function CyclesPage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/Signin');
  }

  // Check if user is admin
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  let cycles: any[] = [];
  let error = null;

  try {
    const response = await fetchCycles();
    // console.log('Fetched cycles:', response.data as any);
    cycles = Array.isArray(response?.data.cycles) ? response.data.cycles : [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch cycles';
    console.error('Cycles fetch error:', err);
    cycles = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Application Cycles</h1>
                <p className="text-gray-600 mt-2">Create and manage recruitment cycles</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Filter:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="all">All Cycles</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <Link
                  href="/admin/cycles/new"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Create New Cycle
                </Link>
              </div>
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Cycles</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {cycles.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">No cycles found</p>
                  <Link
                    href="/admin/cycles/new"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                  >
                    Create First Cycle
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cycles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {cycles.map((cycle: any) => (
                      <CycleCard key={cycle.id} cycle={cycle} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
                    <div className="text-sm text-gray-700">
                      Showing 1 to {cycles.length} of {cycles.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-500 bg-gray-50 cursor-not-allowed">
                        &lt;
                      </button>
                      <button className="px-3 py-1 text-sm border border-blue-600 rounded-md text-white bg-blue-600">
                        1
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        &gt;
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
