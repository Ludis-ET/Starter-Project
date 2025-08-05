import { Header } from "@/components/Header";
import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <Header userRole="admin" />
      <div className="px-62 py-12">
        <h1 className="text-3xl font-bold py-4 text-black dark:text-white">
          Admin Command Center
        </h1>
        <div className="flex flex-wrap items-center gap-12 pb-12">
          <div className="w-[25%] bg-purple-500 text-white rounded-md p-6">
            <h3>Total Users</h3>
            <h4 className="text-4xl font-semibold">125</h4>
          </div>
          <div className="w-[25%] bg-green-500 text-white rounded-md p-6">
            <h3>Total Applicants</h3>
            <h4 className="text-4xl font-semibold">125</h4>
          </div>
          <div className="w-[25%] bg-orange-500 text-white rounded-md p-6">
            <h3>Active Cycles</h3>
            <h4 className="text-4xl font-semibold">125</h4>
          </div>
        </div>
        <div>
            <div className="w-[30%] shadow-lg p-8 rounded-md flex flex-col gap-2">
                <h2 className="font-bold text-2xl">Manage Users</h2>
                <p className="font-light">create, edit, and manage user accounts and roles</p>
                <Link href="/admin/users">Goto Users</Link>
            </div>
            <div className="w-[30%] shadow-lg p-8 rounded-md flex flex-col gap-2">
                <h2 className="font-bold text-2xl">Manage Users</h2>
                <p className="font-light">create, edit, and manage user accounts and roles</p>
                <Link href="/admin/users">Goto Users</Link>
            </div>
            <div className="w-[30%] shadow-lg p-8 rounded-md flex flex-col gap-2">
                <h2 className="font-bold text-2xl">Manage Users</h2>
                <p className="font-light">create, edit, and manage user accounts and roles</p>
                <Link href="/admin/users">Goto Users</Link>
            </div>
        </div>
      </div>
    </>
  );
}
