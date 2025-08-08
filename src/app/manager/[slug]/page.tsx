import React from "react";
import Link from "next/link";
import ManagerActions from "@/components/ManagerActionsClient";
const BASE_URL = "https://a2sv-application-platform-backend-team5.onrender.com";

interface Props {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: Props) => {
  const slug = params.slug;

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMWE3YWYzZC1mOWMzLTQzYWQtYWFkYy01N2EzNGFkZmU3NzciLCJleHAiOjE3NTQ1OTg2NjcsInR5cGUiOiJhY2Nlc3MifQ.8xjntUhXds2dFkn7fdQhkRna9_LjPxcHirFkAwv7JPQ";

  const res = await fetch(`${BASE_URL}/manager/applications/${slug}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const details = data.data.application;
  console.log(details);

  if (!details) return <h2>No Details</h2>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold mb-10 w-[1250px] mx-auto">
        Manage: Abel Tadesse
      </h1>

      <div className="flex justify-center gap-10 flex-wrap">
        {/* Left Side: Profile + Review */}
        <div className="grid grid-cols-1 gap-6">
          {/* Applicant Profile */}
          <div className="bg-white border rounded-xl shadow p-6 w-[900px]">
            <h2 className="text-xl font-semibold mb-4">Applicant Profile</h2>
            <div className="flex flex-col gap-6">
              <div className="flex gap-100">
                <div>
                  <div className="text-sm text-gray-500">School</div>
                  <p className="font-medium">{details.school}</p>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Degree Program</div>
                  <p className="font-medium">{details.degree}</p>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Coding Profiles</div>
                <div className="flex gap-3 font-medium">
                  <p>GitHub</p>
                  <p>LeetCode</p>
                  <p>Codeforces</p>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Essay 1: Tell us about yourself
                </div>
                <p>{details.essay_about_you}</p>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Essay 2: Why do you want to join us?
                </div>
                <p>{details.essay_why_a2sv}</p>
              </div>

              <div>
                <div className="text-sm text-gray-500">Resume</div>
                <Link
                  href={details.resume_url ? details.resume_url : ""}
                  className="text-violet-700 underline"
                >
                  View Resume.pdf
                </Link>
              </div>
            </div>
          </div>

          {/* Reviewer Feedback */}
          <div className="bg-white border rounded-xl shadow p-6 w-[900px]">
            <h2 className="text-xl font-semibold mb-4">
              Reviewer's Feedback (Jane R.)
            </h2>

            <div className="mb-4">
              <div className="text-sm text-gray-500">Activity Check</div>
              <p>Pass - 50 LC, 35 CF, 30 days active</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i}>
                  <div className="text-sm text-gray-500">Resume Score</div>
                  <p>85/100</p>
                </div>
              ))}
            </div>

            <div>
              <div className="text-sm text-gray-500">Interviewer Notes</div>
              <p>Strong candidate with excellent problem-solving skills.</p>
            </div>
          </div>
        </div>

        {/* Manager Actions Section (Client-side buttons) */}
        <ManagerActions slug={slug} accessToken={accessToken} />
      </div>
    </div>
  );
};

export default Page;
