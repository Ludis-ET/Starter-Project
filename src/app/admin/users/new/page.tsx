import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import CreateUserForm from '@/components/admin/CreateUserForm';
import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';

export default async function CreateUserPage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/Signin');
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
              href="/admin/users" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Users
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New User</h1>
            <p className="text-gray-600 mt-2">Use this form to create a new user and assign them a role.</p>
          </div>

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              </div>
            </div>
            
            <div className="p-6">
              <CreateUserForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
