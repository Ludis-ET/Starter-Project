import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchCycles } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import CyclesClient from "@/components/admin/CyclesClient";

interface Props {
  searchParams: Promise<URLSearchParams | Record<string, string | undefined>>;
}

const ITEMS_PER_PAGE = 6;

export default async function CyclesPage({ searchParams }: Props) {
  const session = await getServerSession(options);

  if (!session) redirect("/signin");
  if (session.user?.role !== "admin") redirect("/");

  let cycles: any[] = [];
  let error = null;

  try {
    const response = await fetchCycles();
    cycles = Array.isArray(response?.data.cycles) ? response.data.cycles : [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch cycles";
    cycles = [];
  }

  // Await searchParams before using
  const params = await searchParams;
  const filter =
    params instanceof URLSearchParams
      ? params.get("filter") ?? "all"
      : params.filter ?? "all";
  const pageStr =
    params instanceof URLSearchParams
      ? params.get("page") ?? "1"
      : params.page ?? "1";
  const currentPage = parseInt(pageStr, 10);

  // Apply filter
  let filteredCycles = [...cycles];
  if (filter !== "all") {
    if (filter === "active") {
      filteredCycles = filteredCycles.filter((c) => c.is_active);
    } else if (filter === "inactive") {
      filteredCycles = filteredCycles.filter((c) => !c.is_active);
    } else if (filter === "upcoming") {
      const now = new Date();
      filteredCycles = filteredCycles.filter(
        (c) => new Date(c.start_date) > now
      );
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredCycles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCycles = filteredCycles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader userRole="Admin User" />
      <div className="p-8 max-w-7xl mx-auto">
        <CyclesClient
          cycles={paginatedCycles}
          totalCycles={filteredCycles.length}
          currentPage={currentPage}
          totalPages={totalPages}
          filter={filter}
          error={error}
        />
      </div>
    </div>
  );
}
