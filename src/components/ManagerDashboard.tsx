"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomDropdown from "./CustomDropdown";

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
  applications,
}) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMWE3YWYzZC1mOWMzLTQzYWQtYWFkYy01N2EzNGFkZmU3NzciLCJleHAiOjE3NTQ1OTg2NjcsInR5cGUiOiJhY2Nlc3MifQ.8xjntUhXds2dFkn7fdQhkRna9_LjPxcHirFkAwv7JPQ";

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await fetch(
          BASE_URL + "/manager/applications/available-reviewers/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ); // Replace with your actual API endpoint
        const data = await response.json();
        // Merge fetched reviewers with dummy stats
        const mergedReviewers = data.data.reviewers.map(
          (reviewer: any, index: number) => ({
            id: reviewer.id,
            name: reviewer.full_name,
            stats: dummyStats[index % dummyStats.length].stats, // Cycle through dummy stats
            reviews: dummyStats[index % dummyStats.length].reviews, // Cycle through dummy reviews
          })
        );
        setReviewers(mergedReviewers);
      } catch (error) {
        console.error("Error fetching reviewers:", error);
        // Fallback to dummy reviewers if API call fails
        setReviewers([
          {
            id: "1",
            name: "Michael Smith",
            stats: "3 Assigned / Avg. 2.5 days",
            reviews: 12,
          },
          {
            id: "2",
            name: "Sarah Lee",
            stats: "4 Assigned / Avg. 1.8 days",
            reviews: 15,
          },
          {
            id: "3",
            name: "John Doe",
            stats: "2 Assigned / Avg. 3.1 days",
            reviews: 8,
          },
        ]);
      }
    };

    fetchReviewers();
  }, []);

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
          <StatCard title="Total Applications" value="132" />
          <StatCard title="Under Review" value="45" />
          <StatCard title="Interview Stage" value="23" />
          <StatCard title="Accepted" value="12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Applications</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="All">Filter by Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Interview">Interview</option>
                <option value="Accepted">Accepted</option>
              </select>
            </div>

            <table className="w-full text-sm text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="px-1">APPLICANT</th>
                  <th className="px-1">SUBMITTED</th>
                  <th className="px-1">ASSIGNED REVIEWER</th>
                  <th className="px-1">STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter(
                    (app) =>
                      filterStatus === "All" || app.status === filterStatus
                  )
                  .map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-1">{app.applicant_name}</td>
                      <td className="px-1">
                        {new Date().toISOString().split("T")[0]}
                      </td>
                      <td className="px-1">
                        {app.assigned_reviewer_name
                          ? app.assigned_reviewer_name
                          : "None"}
                      </td>
                      <td className="px-1">{app.status}</td>
                      <td>
                        <CustomDropdown reviewers={reviewers} app={app} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="bg-white rounded-xl shadow-2xl p-6">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default ManagerDashboard;
