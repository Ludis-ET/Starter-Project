"use client";

import ApplicantNav from "@/components/app/ApplicantNav";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RiProgress1Fill } from "react-icons/ri";
import { GrFormSchedule } from "react-icons/gr";
import { useSession } from "next-auth/react";

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatStatus(status?: string | null) {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getProfile(accessToken: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

async function getApplicationData(applicationId: string, accessToken: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/applications/${applicationId}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

async function getApplicationStatus(accessToken: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/applications/my-status/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

const Inprogress = () => {
  const { data: session, status } = useSession();
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<{
    current?: string;
    previous?: string | null;
    changed: boolean;
    fetchedAt?: string;
  }>({ changed: false });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Fetch submitted_at
  useEffect(() => {
    const run = async () => {
      if (status !== "authenticated") return;
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) return;
      setLoadingProfile(true);
      try {
        const profile = await getProfile(accessToken);
        const applicationId = profile?.id;
        if (!applicationId) return;
        const application = await getApplicationData(
          applicationId,
          accessToken
        );
        setSubmittedAt(application?.submitted_at ?? null);
      } finally {
        setLoadingProfile(false);
      }
    };
    run();
  }, [session, status]);

  // Fetch current status
  useEffect(() => {
    const run = async () => {
      if (status !== "authenticated") return;
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) return;
      setLoadingStatus(true);
      try {
        const data = await getApplicationStatus(accessToken);
        if (!data) return;
        const prev =
          typeof window !== "undefined"
            ? localStorage.getItem("app_status_last")
            : null;
        const changed = !!prev && prev !== data.status;
        if (typeof window !== "undefined") {
          localStorage.setItem("app_status_last", data.status);
        }
        setStatusState({
          current: data.status,
          previous: changed ? prev : null,
          changed,
          fetchedAt: data.submitted_at,
        });
      } finally {
        setLoadingStatus(false);
      }
    };
    run();
  }, [session, status]);

  const accessToken = (session as any)?.accessToken;
  const initialLoading =
    status === "loading" ||
    (status === "authenticated" && !accessToken) ||
    (status === "authenticated" && (loadingProfile || loadingStatus));

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <ApplicantNav />
        <div className="animate-pulse max-w-7xl mx-auto px-14 py-8 space-y-8">
          <div className="h-8 bg-gray-200 w-1/3 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-40 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-56 bg-gray-200 rounded" />
              <div className="h-40 bg-gray-200 rounded" />
              <div className="h-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-100">
        <ApplicantNav />
        <div className="max-w-xl mx-auto mt-24 text-center">
          <p className="text-gray-600">Please sign in to view your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ApplicantNav />

      <div className="pl-14 pt-6">
        <p className="text-3xl font-bold mb-1">Your Application Progress</p>
        <p className="text-gray-500 mb-4">
          You’re on your way! Here’s a summary of your application status.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-14 py-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div>
            <p className="font-semibold text-lg">Application Timeline</p>

            <div className="relative mb-6 pl-6">
              <span className="absolute -left-3 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 border-2 border-white">
                <FaCheck className="text-white" size={16} />
              </span>
              <div className="mt-4">
                <span className="absolute left-1 top-5 w-0.5 h-20 bg-gray-300 mt-4"></span>
              </div>
              <h3 className="font-semibold">Application Submitted</h3>
              <p className="text-xs text-gray-400">
                {submittedAt ? formatDate(submittedAt) : "Loading..."}
              </p>
              <p className="text-gray-600">
                Your application has been successfully submitted.
              </p>
            </div>

            <div className="relative mb-6 pl-6 mt-14">
              <span className="absolute -left-3 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#4F46E5] border-2 border-white">
                <RiProgress1Fill className="text-white" size={16} />
              </span>
              <span className="absolute left-1 top-5 w-0.5 h-18 bg-gray-300 mt-4"></span>
              <h3 className="font-semibold">
                {statusState.current
                  ? formatStatus(statusState.current)
                  : "Loading..."}
              </h3>
              <p className="text-xs text-gray-400">Current Stage</p>
              <p className="text-gray-600">
                Our team is currently reviewing your application.
              </p>
            </div>

            <div className="relative mb-6">
              <div className="flex gap-6">
                <div>
                  <span className="absolute -left-[9px] top-0 w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">
                    Interview Stage
                  </h3>
                </div>
              </div>
              <div>
                <span className="absolute left-1 top-5 w-0.5 h-6 bg-gray-300 mt-3 mb-6"></span>
              </div>
            </div>

            <div className="relative mt-8">
              <div className="flex gap-6">
                <div>
                  <span className="absolute -left-[9px] top-0 w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-400">Decision Made</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="relative flex items-center pl-8">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white">
                  <FaCheck className="text-green-400" size={18} />
                </span>
                <div className="pl-2">
                  <span>Application Submitted </span>
                  <div className="text-xs text-gray-400">
                    {submittedAt ? formatDate(submittedAt) : "Loading..."}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center pl-8">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white">
                  <GrFormSchedule className="text-[#3B82F6]" size={20} />
                </span>
                <div className="pl-2">
                  <span>Interview Scheduled </span>
                  <div className="text-xs text-gray-400">November 5, 2023</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Important Updates</h3>
            {statusState.changed ? (
              <div className="text-sm text-gray-700">
                <p>
                  Status changed from{" "}
                  <span className="font-semibold">
                    {formatStatus(statusState.previous || "")}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {formatStatus(statusState.current)}
                  </span>
                  .
                </p>
                {submittedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {formatDate(submittedAt)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                There are no new updates at this time. We will notify you by
                email when your application status changes.
              </p>
            )}
          </div>

          <div className="bg-[#4F46E5] p-6 rounded-lg text-white shadow">
            <h3 className="font-semibold mb-2">Get Ready for the Interview!</h3>
            <p className="text-sm">
              While you wait, practice problem-solving on LeetCode & Codeforces.
            </p>
            <a href="#" className="mt-3 inline-block  text-sm">
              Read our interview prep guide →
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Inprogress;
