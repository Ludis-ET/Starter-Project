import BodyOne from "./components/mainPageComponents/BodyOne";
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function Home() {
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
    <div className="min-h-screen">
      <BodyOne />
    </div>
  );
}
