import ManagerDashboard from "../../components/manager/ManagerDashboard";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import ManagerHeader from "@/components/manager/ManagerHeader";
import LandingFooter from "../../components/app/Footer/Landingfooter";

export default async function Page() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const session = await getServerSession(options);
  const accessToken = session?.accessToken;

  // Redirect unauthenticated users
  if (!session) {
    redirect("/signin");
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
      <div className="bg-gray-100">
        <ManagerDashboard applications={applications} />;
      </div>
      <LandingFooter />
    </>
  );
}
