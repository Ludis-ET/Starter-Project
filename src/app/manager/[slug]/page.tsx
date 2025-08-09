import React from "react";
import Link from "next/link";
import ManagerActions from "@/components/ManagerActionsClient";
const BASE_URL = "https://a2sv-application-platform-backend-team5.onrender.com";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: Props) => {
  const slug = params.slug;

  const session = await getServerSession(options);
  const accessToken = session?.accessToken;

  const res = await fetch(`${BASE_URL}/manager/applications/${slug}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  const details = data.data.application;
  const review = data.data.review;
  if (review) {
    const scores: string[] = [];
    scores.push(review.resume_score);
    scores.push(review.essay_about_you_score);
    scores.push(review.essay_why_a2sv_score);
    scores.push(review.behavioral_interview_score);
    console.log(data.data);
  }
  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold mb-10 w-[1250px] mx-auto">
        Manage: {details.applicant_name}
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
            {review ? (
              <h2 className="text-xl font-semibold mb-4">
                Reviewer's Feedback (Jane R.)
              </h2>
            ) : (
              <h2 className="text-xl font-semibold mb-4">
                No yet reviewed ...
              </h2>
            )}

            {review && (
              <>
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Activity Check</div>
                  <p>{review.activity_check_notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    "Resume Score",
                    "Essay Score",
                    "Tech Interview",
                    "Behavioral",
                  ].map((title, i) => (
                    <div key={i}>
                      <div className="text-sm text-gray-500">{title}</div>
                      <p>{scores[i]}/100</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-sm text-gray-500">Interviewer Notes</div>
                  <p>{review.interview_notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Manager Actions Section (Client-side buttons) */}
        <ManagerActions slug={slug} accessToken={accessToken} />
      </div>
    </div>
  );
};

export default Page;
