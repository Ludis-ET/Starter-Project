import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function ReviewerPage() {
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
  if (role !== 'reviewer') {
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Link href="/applicant">
            <Image src="/assets/Logo.png" alt="Logo" className="h-12 w-auto" width={120} height={48} priority />
          </Link>
        </div>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Reviewer Dashboard</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {session.user.full_name || 'Reviewer'}! Review applicant submissions here.
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            [Placeholder: Your team can implement reviewer features here.]
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/Signin"
            className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}