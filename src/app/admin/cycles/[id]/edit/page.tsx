import { getServerSession } from 'next-auth/next';
import { redirect, notFound } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { fetchCycles } from '@/lib/admin-api';
import EditCycleForm from '@/components/admin/EditCycleForm';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditCyclePage({ params }: Props) {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/Signin');
  }

  // Check if user is admin
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  let cycle = null;
  let error = null;

  try {
    const response = await fetchCycles();
    const cycles = response.data || [];
    cycle = cycles.find((c: any) => c.id === parseInt(params.id));
    
    if (!cycle) {
      notFound();
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch cycle';
    console.error('Cycle fetch error:', err);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader userRole="Admin User" />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link 
                href="/admin/cycles" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Cycles
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Cycle</h1>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Cycle</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader userRole="Admin User" />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading cycle...</p>
              </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Link 
              href="/admin/cycles" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Cycles
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Edit Cycle: {cycle.name}
            </h1>
            <p className="text-gray-600 mt-2">Update cycle details and settings</p>
          </div>

          {/* Edit Cycle Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <EditCycleForm cycle={cycle} cycleId={parseInt(params.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
