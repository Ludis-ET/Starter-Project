import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchCycles } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import CyclesClient from "@/components/admin/CyclesClient";

export default async function CyclesPage() {
  const session = await getServerSession(options);

  if (!session) redirect("/Signin");
  if (session.user?.role !== "admin") redirect("/");

  let cycles:any[] = [];

  try {
    const response = await fetchCycles();
    cycles = response.data.cycles || [];
  } catch {
    cycles = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8 max-w-7xl mx-auto">
        <CyclesClient initialCycles={cycles} />
      </div>
    </div>
  );
}
