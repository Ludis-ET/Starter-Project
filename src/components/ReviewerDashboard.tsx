"use client";

import React, { useState, useEffect } from "react";
import AppCard from "./ReviewerCard";
import { AppData } from "@/types";

const ReviewerDashboard = () => {
  const [applications, setApplications] = useState<AppData[]>([]);
  const [filter, setFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZTZjMGU4NC05NzI3LTQ2MTMtYTBjZi01NjRiMDE5MWE0MGQiLCJleHAiOjE3NTQ1NTM5OTAsInR5cGUiOiJhY2Nlc3MifQ.bFkCg2Aks2c674gHcogXBV6DNfze6b34UYwYtX_baRw";

        if (!token) {
          console.error("No access token found.");
          return;
        }

        const res = await fetch(
          "https://a2sv-application-platform-backend-team5.onrender.com/applications/assigned",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        const data: AppData[] = result.data.applications.map(
          (app: any): AppData => ({
            id: app.id,
            name: app.applicant_name,
            submitted: "-", // API doesn't provide submission date
            status:
              app.status === "in_progress"
                ? "Under Review"
                : app.status === "completed"
                ? "Review Complete"
                : "New", // Adjust based on your status enums
          })
        );

        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleFilter = (status: string) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortAsc(!sortAsc);
    setApplications(
      [...applications].sort((a, b) => {
        return sortAsc
          ? new Date(a.submitted).getTime() - new Date(b.submitted).getTime()
          : new Date(b.submitted).getTime() - new Date(a.submitted).getTime();
      })
    );
    setCurrentPage(1);
  };

  const filteredApps = applications.filter(
    (app) => filter === "All" || app.status === filter
  );
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-5 px-5">
      <div className="flex flex-col">
        <h1 className="text-black text-3xl font-bold">Assigned Applications</h1>
        <p className="text-[#4B5563]">
          You have {applications.length} applications waiting for your review.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-3 flex-wrap">
          <div className="flex gap-3 flex-wrap">
            <button
              className={`px-2 py-1 rounded-lg ${
                filter === "All"
                  ? "bg-[#4F46E5] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563]"
              }`}
              onClick={() => handleFilter("All")}
            >
              All
            </button>
            <button
              className={`px-2 py-1 rounded-lg ${
                filter === "Under Review"
                  ? "bg-[#4F46E5] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563]"
              }`}
              onClick={() => handleFilter("Under Review")}
            >
              Under Review
            </button>
            <button
              className={`px-2 py-1 rounded-lg ${
                filter === "Complete"
                  ? "bg-[#4F46E5] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563]"
              }`}
              onClick={() => handleFilter("Complete")}
            >
              Complete
            </button>
          </div>
          <button
            className={`px-2 py-1 rounded-lg ${
              sortAsc
                ? "bg-[#4F46E5] text-white"
                : "bg-[#E5E7EB] text-[#4B5563]"
            }`}
            onClick={handleSort}
          >
            Sort by Submission Date
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[#374151]">
        <p>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredApps.length)} of{" "}
          {filteredApps.length} results
        </p>
        <span className="flex gap-2">
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            1
          </button>
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(2)}
            disabled={currentPage === 2}
          >
            2
          </button>
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(3)}
            disabled={currentPage === 3}
          >
            3
          </button>
          <button className="px-2 py-1 bg-[#E5E7EB] rounded">…</button>
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(7)}
            disabled={currentPage === 7}
          >
            7
          </button>
          <button
            className="px-2 py-1 bg-[#E5E7EB] rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </span>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
