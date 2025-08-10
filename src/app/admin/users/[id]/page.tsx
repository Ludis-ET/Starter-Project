import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchUserById } from "@/lib/admin-api";
import UserEditForm from "@/components/admin/UserEditForm";
import AdminHeader from "@/components/admin/AdminHeader";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(options);

  if (!session) {
    redirect("/signin");
  }

  if (session.user?.role !== "admin") {
    redirect("/");
  }

  let user = null;
  let error = null;

  try {
    const response = await fetchUserById(id);
    user = response.data;
    
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) {
      notFound();
    }
    error = err instanceof Error ? err.message : "Failed to fetch user";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader userRole="Admin User" />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Users
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">
                User Details
              </h1>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error Loading User
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader userRole="Admin User" />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading user...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/admin/users"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Users
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">
                  Edit User: {user.full_name}
                </h1>
                <p className="text-gray-600 mt-2">
                  Update user details and role
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <UserEditForm user={user} userId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
