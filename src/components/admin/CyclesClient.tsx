"use client";

import Link from "next/link";

interface Cycle {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  start_date: string;
}

interface Props {
  cycles: Cycle[];
  totalCycles: number;
  currentPage: number;
  totalPages: number;
  filter: string;
  error: string | null;
}

const ITEMS_PER_PAGE = 6;

export default function CyclesClient({ cycles, totalCycles, currentPage, totalPages, filter, error }: Props) {
  const createQuery = (page: number, filterValue: string) => `?page=${page}&filter=${filterValue}`;

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Cycles</h1>
            <p className="text-gray-600 mt-2">Create and manage recruitment cycles</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                defaultValue={filter}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("filter", e.target.value);
                  url.searchParams.set("page", "1");
                  window.location.href = url.toString();
                }}
              >
                <option value="all">All Cycles</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <Link
              href="/admin/cycles/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Create New Cycle
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Cycles</h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : cycles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No cycles found</p>
          <Link
            href="/admin/cycles/new"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Create First Cycle
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cycles.map((cycle) => (
              <CycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>

          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCycles)} of {totalCycles} results
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={createQuery(Math.max(currentPage - 1, 1), filter)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                tabIndex={currentPage === 1 ? -1 : 0}
                aria-disabled={currentPage === 1}
              >
                &lt;
              </Link>

              {[...Array(totalPages).keys()].map((num) => {
                const pageNum = num + 1;
                return (
                  <Link
                    key={pageNum}
                    href={createQuery(pageNum, filter)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              <Link
                href={createQuery(Math.min(currentPage + 1, totalPages), filter)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                tabIndex={currentPage === totalPages ? -1 : 0}
                aria-disabled={currentPage === totalPages}
              >
                &gt;
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
