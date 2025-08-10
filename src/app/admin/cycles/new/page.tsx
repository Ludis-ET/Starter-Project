import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import CreateCycleForm from '@/components/admin/CreateCycleForm';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';

export default async function CreateCyclePage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/signin');
  }

  // Check if user is admin
  if (session.user?.role !== 'admin') {
    redirect('/');
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
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Create new cycle</h1>
            <p className="text-gray-600 mt-2">Use this form to create a new cycle and assign periods.</p>
          </div>

          {/* Create Cycle Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <CreateCycleForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
