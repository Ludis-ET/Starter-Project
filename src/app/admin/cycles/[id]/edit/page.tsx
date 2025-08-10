import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchCycles } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import Link from "next/link";
import EditCycleForm from "@/components/admin/EditCycleForm";

interface EditCyclePageProps {
  params: { id: string };
}

export default async function EditCyclePage({ params }: EditCyclePageProps) {
  const session = await getServerSession(options);

  if (!session) redirect("/signin");
  if (session.user?.role !== "admin") redirect("/");

  let cycles: any[] = [];
  let cycle: any = null;

  try {
    const response = await fetchCycles();
    cycles = response.data.cycles || [];
    cycle = cycles.find((c) => String(c.id) === String(params.id)) || null;
  } catch {
    cycles = [];
    cycle = null;
  }

  if (!cycle) {
    redirect("/admin/cycles");
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
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Edit cycle
            </h1>
            <p className="text-gray-600 mt-2">
              Update the details of this cycle and assigned periods.
            </p>
          </div>

          {/* Edit Cycle Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <EditCycleForm cycle={cycle} cycleId={cycle.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
