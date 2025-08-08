import ManagerDashboard from "../../components/ManagerDashboard";
const BASE_URL = "https://a2sv-application-platform-backend-team5.onrender.com";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(options);
  const accessToken = session?.accessToken;

  // Redirect unauthenticated users
  if (!session) {
    redirect("/Signin");
  }

  // Define role-specific redirect URLs
  const roleRedirects: { [key: string]: string } = {
    admin: "/admin",
    manager: "/manager",
    reviewer: "/reviewer",
    applicant: "/applicant",
  };

  // Get the user's role, default to 'applicant'
  const role = session.user?.role || "applicant";
  const redirectUrl = roleRedirects[role] || "/applicant";

  // Redirect unauthorized users
  if (role !== "manager") {
    redirect(redirectUrl);
  }

  const res = await fetch(BASE_URL + "/manager/applications/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // if (res.status === 401) {
  //   // Token expired or unauthorized
  //   return (
  //     <div className="p-8">
  //       <h1 className="text-xl font-bold text-red-600">Unauthorized</h1>
  //       <p>
  //         Your session has expired. Please{" "}
  //         <a href="/login" className="underline text-blue-600">
  //           log in again
  //         </a>
  //         .
  //       </p>
  //     </div>
  //   );
  // }

  // if (!res.ok) {
  //   // Handle other errors
  //   return (
  //     <div className="p-8">
  //       <h1 className="text-xl font-bold text-red-600">
  //         Error loading applications
  //       </h1>
  //       <p>Status: {res.status}</p>
  //     </div>
  //   );
  // }

  const response = await res.json();

  const applications = response.data?.applications ?? [];

  return <ManagerDashboard applications={applications} />;
}
