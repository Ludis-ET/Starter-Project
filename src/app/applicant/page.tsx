import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function ApplicantPage() {
  const session = await getServerSession(options);

  // Redirect unauthenticated users
  if (!session) {
    redirect('/signin');
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
  if (role !== 'applicant') {
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
          <h2 className="text-center text-3xl font-bold text-gray-900">Applicant Dashboard</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {session.user.full_name || 'Applicant'}! Submit your application here.
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            [Placeholder: Your team can implement ApplicationForm.tsx here.]
          </p>
        </div>
        <div className="flex flex-row justify-center text-center gap-5">
            <Link
            href="/applicant/apply"
            className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </Link>
          <Link
            href="/signin"
            className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}