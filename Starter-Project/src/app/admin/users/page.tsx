import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchUsers } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import UsersTable from "@/components/admin/UsersTable";
import Link from "next/link";

export default async function UsersPage() {
  const session = await getServerSession(options);

  if (!session) redirect("/Signin");
  if (session.user?.role !== "admin") redirect("/");

  let users: any[] = [];
  try {
    const response = await fetchUsers();
    users = Array.isArray(response?.data.users) ? response.data.users : [];
  } catch (err) {
    console.error("Users fetch error:", err);
    users = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          User Management
        </h1>
          <Link
            href="/admin/users/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors mb-4"
          >
            Add New User
          </Link>
        </div>
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
