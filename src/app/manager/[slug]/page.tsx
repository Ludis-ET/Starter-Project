import React from "react";
import Link from "next/link";
import ManagerActions from "@/components/manager/ManagerActionsClient";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import BackBtn from "@/components/manager/BackBtn";
import ManagerHeaderForDetails from "@/components/manager/ManagerHeaderForDetails";
import AllrightsReservedFooter from "@/components/manager/AllrightsReservedFooter";

interface Props {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: Props) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const scores: string[] = [];

  if (review) {
    scores.push(review.resume_score);
    scores.push(review.essay_about_you_score);
    scores.push(review.essay_why_a2sv_score);
    scores.push(review.behavioral_interview_score);
    console.log(data.data);
  }
  return (
    <div className="bg-gray-100">
      <ManagerHeaderForDetails userRole="manager" />
      <div className="p-4 sm:p-6 md:p-10">
        <div className="items-center gap-4 w-full md:w-[1250px] mx-auto mb-6 md:mb-10">
          <BackBtn />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
            Manage: {details.applicant_name}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-10">
          {/* Left Side: Profile + Review */}
          <div className="grid grid-cols-1 gap-6">
            {/* Applicant Profile */}
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[900px]">
              <h2 className="text-xl font-semibold mb-4">Applicant Profile</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 lg:gap-100">
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
                  <div className="flex gap-3 font-medium text-indigo-600">
                    <Link href="">GitHub</Link>
                    <Link href={details.leetcode_handle}>LeetCode</Link>
                    <Link href={details.codeforces_handle}>Codeforces</Link>
                  </div>
                </div>

                <div className="break-words">
                  <div className="text-sm text-gray-500 mb-1">
                    Essay 1: Tell us about yourself
                  </div>
                  <p>{details.essay_about_you}</p>
                </div>

                <div className="break-words">
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
            <div className="bg-white rounded-xl shadow-2xl p-6 lg:w-[900px]">
              {review ? (
                <h2 className="text-xl font-semibold mb-4">
                  Reviewer's Feedback.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                    <div className="text-sm text-gray-500">
                      Interviewer Notes
                    </div>
                    <p>{review.interview_notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Manager Actions Section (Client-side buttons) */}
          <ManagerActions
            slug={slug}
            accessToken={accessToken}
            initialStatus={details.status}
          />
        </div>
      </div>
      <AllrightsReservedFooter />
      </div>
  );
};

export default Page;
