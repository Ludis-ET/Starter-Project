import ManagerDashboard from "../../components/manager/ManagerDashboard";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import ManagerHeader from "@/components/manager/ManagerHeader";
import LandingFooter from "../components/Footer/Landingfooter";

export default async function Page() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = await getServerSession(options);
  const accessToken = session?.accessToken;

  // Redirect unauthenticated users
  if (!session) {
    redirect("/signin");
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

  const response = await res.json();

  const applications = response.data?.applications ?? [];

  return (
    <>
      <ManagerHeader userRole="manager" />
      <ManagerDashboard applications={applications} />;
      <LandingFooter />
    </>
  );
}
