"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import CustomDropdown from "./CustomDropdown";
import { useSession, signOut, getSession } from "next-auth/react";
import { useMemo } from "react";
import ReviwApplication from "./ReviwApplication";
import SearchBox from "./SearchBox";

interface Reviewer {
  id: string;
  name: string;
  stats: string;
  reviews: number;
}

interface Application {
  id: string;
  applicant_name: string;
  submitted?: string;
  assigned_reviewer_name: string;
  status: string;
}

// Dummy stats to merge with fetched reviewers
const dummyStats = [
  { stats: "3 Assigned / Avg. 2.5 days", reviews: 12 },
  { stats: "4 Assigned / Avg. 1.8 days", reviews: 15 },
  { stats: "2 Assigned / Avg. 3.1 days", reviews: 8 },
];

const ManagerDashboard: React.FC<{ applications: Application[] }> = ({
  applications: initialApplications,
}) => {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [filterStatus, setFilterStatus] = useState("All");
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session, status, update } = useSession();
  const accessToken = session?.accessToken;

  const refetchApplications = async () => {
    if (status !== "authenticated" || !accessToken) {
      console.error("No valid session or access token");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/manager/applications/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        if (session?.refreshToken) {
          await update();
          const updatedSession = await getSession();
          if (!updatedSession?.accessToken) {
            throw new Error("Failed to get updated session");
          }
          const retryResponse = await fetch(
            `${BASE_URL}/manager/applications/`,
            {
              headers: {
                Authorization: `Bearer ${updatedSession.accessToken}`,
              },
            }
          );
          if (!retryResponse.ok) {
            throw new Error(
              `Retry failed with status: ${retryResponse.status}`
            );
          }
          const retryData = await retryResponse.json();
          if (retryData.success) {
            setApplications(retryData.data.applications);
          } else {
            console.error("Retry failed:", retryData.message);
          }
        } else {
          console.error("No refresh token available");
          await signOut({ callbackUrl: "/signin" });
        }
      } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const data = await response.json();
        setApplications(data.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications(initialApplications);
    }
  };

  useEffect(() => {
    refetchApplications();
  }, [session, status, update]);

  useEffect(() => {
    const fetchReviewers = async () => {
      if (status !== "authenticated" || !session?.accessToken) {
        console.error("No valid session or access token");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/manager/applications/available-reviewers/`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          if (session?.refreshToken) {
            try {
              await update();
              const updatedSession = await getSession();
              if (!updatedSession?.accessToken) {
                throw new Error("Failed to get updated session");
              }

              const retryResponse = await fetch(
                `${BASE_URL}/manager/applications/available-reviewers/`,
                {
                  headers: {
                    Authorization: `Bearer ${updatedSession.accessToken}`,
                  },
                }
              );

              if (!retryResponse.ok) {
                throw new Error(
                  `Retry failed with status: ${retryResponse.status}`
                );
              }

              const retryData = await retryResponse.json();
              if (retryData.success) {
                const mergedReviewers = retryData.data.reviewers.map(
                  (reviewer: any, index: number) => ({
                    id: reviewer.id,
                    name: reviewer.full_name,
                    stats: dummyStats[index % dummyStats.length].stats,
                    reviews: dummyStats[index % dummyStats.length].reviews,
                  })
                );
                setReviewers(mergedReviewers);
              } else {
                console.error("Retry failed:", retryData.message);
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
              await signOut({ callbackUrl: "/signin" });
            }
          } else {
            console.error("No refresh token available");
            await signOut({ callbackUrl: "/signin" });
          }
        } else if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          const data = await response.json();
          const mergedReviewers = data.data.reviewers.map(
            (reviewer: any, index: number) => ({
              id: reviewer.id,
              name: reviewer.full_name,
              stats: dummyStats[index % dummyStats.length].stats,
              reviews: dummyStats[index % dummyStats.length].reviews,
            })
          );
          setReviewers(mergedReviewers);
        }
      } catch (error) {
        console.error("Error fetching reviewers:", error);
      }
    };

    fetchReviewers();
  }, [session, status, update]);

  const statusFrequencies = useMemo(() => {
    return applications.reduce((acc, application) => {
      const status = application.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [applications]);
  statusFrequencies["All"] = applications.length;

  //   pagination logic
  const [curPage, setCurPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (curPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  function handleBack() {
    setCurPage(curPage - 1);
  }

  function handleForward() {
    setCurPage(curPage + 1);
  }

  // Review overlay logic
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );

  // Search functionlaity logic
  const [searchText, setSearchText] = useState("");
  const searchedApplications = applications.filter((app) =>
    app.applicant_name.toLowerCase().includes(searchText.toLowerCase())
  );
  const curApplications = searchedApplications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(searchedApplications.length / itemsPerPage);

  useEffect(() => {
    if (isReviewOpen) {
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }

  }, [isReviewOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-500 text-base mt-1">G7 November intake</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={statusFrequencies["All"] || 0}
          />
          <StatCard
            title="Under Review"
            value={statusFrequencies["in_progress"] || 0}
          />
          <StatCard
            title="Interview Stage"
            value={statusFrequencies["pending_review"] || 0}
          />
          <StatCard
            title="Accepted"
            value={statusFrequencies["accepted"] || 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-30 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Applications</h2>
              <SearchBox setSearchText={setSearchText} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-md p-2 text-sm"
              >
                <option value="All" hidden>
                  Filter by Status
                </option>
                <option value="all">All</option>
                <option value="pending_review">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="in_progress">In Progress</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div className="relative">
              <div className="overflow-x-auto min-h-[550px]">
                <table className="w-full text-xs text-left">
                  <thead className="text-gray-500 border border-gray-200 bg-gray-100">
                    <tr>
                      <th className="p-2 px-1">APPLICANT</th>
                      <th className="px-1">SUBMITTED</th>
                      <th className="px-1">ASSIGNED REVIEWER</th>
                      <th className="px-1">STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {curApplications
                      .filter(
                        (app) =>
                          filterStatus === "All" ||
                          filterStatus === "all" ||
                          app.status === filterStatus
                      )
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-gray-100">
                          <td className="p-4 font-semibold">
                            {app.applicant_name}
                          </td>
                          <td className="px-1 font-extralight text-gray-600">
                            {new Date().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-1">
                            <div className="inline-block rounded-2xl bg-gray-200 px-4">
                              {app.assigned_reviewer_name
                                ? app.assigned_reviewer_name
                                : "None"}
                            </div>
                          </td>
                          <td className="px-1">
                            <div className="inline-block rounded-2xl bg-indigo-200 text-blue-950 p-1 px-2">
                              {app.status}
                            </div>
                          </td>
                          <td>
                            <CustomDropdown
                              reviewers={reviewers}
                              app={app}
                              refetchApplications={refetchApplications}
                              setIsReviewOpen={setIsReviewOpen}
                              setSelectedApplication={setSelectedApplication}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* paginaiton nav btns  */}
            <button
              onClick={handleBack}
              className="bg-gray-200 rounded-2xl px-2 mr-2"
              disabled={curPage == 1}
            >
              «
            </button>

            <p className="inline-block p-1 text-sm mr-2">Page {curPage}</p>
            <button
              onClick={handleForward}
              className="bg-gray-200 rounded-2xl px-2"
              disabled={curPage == totalPages}
            >
              »
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Team Performance</h2>
            <div className="space-y-4">
              {reviewers.map((reviewer) => (
                <div
                  key={reviewer.id}
                  className="flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800">{reviewer.name}</p>
                    <p className="text-sm text-gray-500">{reviewer.stats}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">
                    {reviewer.reviews} Reviews
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isReviewOpen && selectedApplication && (
        <ReviwApplication
          slug={selectedApplication}
          setIsReviewOpen={setIsReviewOpen}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => (
  <div className="border border-gray-200 rounded-xl shadow-2xl p-6 bg-white transition-transform duration-300 ease-in-out hover:-translate-y-2">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default ManagerDashboard;
