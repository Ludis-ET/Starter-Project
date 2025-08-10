import BodyOne from "../components/app/mainPageComponents/BodyOne";
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function Home() {
  const session = await getServerSession(options);
  
  
  
    // Define role-specific redirect URLs
    const roleRedirects: { [key: string]: string } = {
      admin: '/admin',
      manager: '/manager',
      reviewer: '/reviewer',
      applicant: '/applicant',
    };
  
      // Redirect unauthenticated users
    if (session) {
      
    // Get the user's role, default to 'applicant'
    const role = session.user?.role || 'applicant';
    const redirectUrl = roleRedirects[role] || '/applicant';
    
      redirect(redirectUrl);
    }
  return (
    <div className="min-h-screen">
      <BodyOne />
    </div>
  );
}
