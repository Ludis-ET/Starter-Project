"use client";

import ApplicantNav from "@/app/components/ApplicantNav";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CiCircleCheck } from "react-icons/ci";

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
  const res = await fetch(`${API_URL}/applications/${applicationId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const result = await res.json();
  return result.data;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingApp, setLoadingApp] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setLoadingProfile(false);
      setLoadingApp(false);
      return;
    }
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      setLoadingProfile(false);
      setLoadingApp(false);
      return;
    }
    setLoadingProfile(true);
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(accessToken);
        setProfileData(profile);
      } catch (err) {
        setProfileData(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [session, status]);

  // Step 2: Fetch application after profile is loaded
  useEffect(() => {
    if (!profileData || !profileData.id) {
      setLoadingApp(false);
      return;
    }
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) {
      setLoadingApp(false);
      return;
    }
    setLoadingApp(true);
    const fetchApp = async () => {
      try {
        const appData = await getApplicationData(profileData.id, accessToken);
        setApplicationData(appData);
      } catch (err) {
        setApplicationData(null);
      } finally {
        setLoadingApp(false);
      }
    };
    fetchApp();
  }, [profileData, session]);

  // Checklist logic
  const profileChecklistItems = [
    { completed: !!profileData?.full_name },
    { completed: !!profileData?.email },
    { completed: !!profileData?.profile_picture_url },
  ];
  const completedProfileItems = profileChecklistItems.filter(
    (i) => i.completed
  ).length;
  const profileCompletionPercentage = profileChecklistItems.length
    ? Math.round((completedProfileItems / profileChecklistItems.length) * 100)
    : 0;
  const isProfileComplete = profileCompletionPercentage === 100;

  const applicationChecklistItems = [
    {
      id: "Create an Account",
      label: "Create an Account",
      completed: !!profileData?.full_name && !!profileData?.email,
    },
    {
      id: "Fill Personal Information",
      label: "Fill Personal Information",
      completed: !!applicationData?.school && !!applicationData?.degree,
    },
    {
      id: "Submit Coding Profiles",
      label: "Submit Coding Profiles",
      completed:
        !!applicationData?.leetcode_handle ||
        !!applicationData?.codeforces_handle,
    },
    {
      id: "Write Essays",
      label: "Write Essays",
      completed:
        !!applicationData?.essay_why_a2sv && !!applicationData?.essay_about_you,
    },
    {
      id: "resume",
      label: "Upload Resume",
      completed: !!applicationData?.resume_url,
    },
  ];

  if (loadingProfile || loadingApp || status === "loading") {
    return (
      <div className="mx-auto px-4 sm:px-6 md:px-28 pt-16">
        <div className="flex flex-col gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ApplicantNav />

      <main className="flex-1 pb-6">
        {/* Welcome Section */}
        <div className="mb-8 px-10 pt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {profileData?.full_name || "User"}!
          </h1>
          <p className="text-gray-600">
            Your journey as a global tech career starts now.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-10">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white border-0 p-10">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  G7 November Intake
                </CardTitle>
                <CardDescription className="text-purple-100">
                  It's time to submit your application and show us your
                  potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 font-medium">
                  <Link href="/applicant/Apply">Start Application</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    Complete Your Profile
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 -mt-4">
                <div className="space-y-2">
                  <Badge
                    className={`font-semibold text-lg border-transparent p-0.5 ${
                      isProfileComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-[#C7D2FE] text-[#6366F1]"
                    }`}
                  >
                    {profileCompletionPercentage}% complete
                  </Badge>
                  <Progress
                    value={profileCompletionPercentage}
                    className="h-3 bg-[#C7D2FE] [&>div]:bg-[#6366F1]"
                  />
                </div>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                >
                  Go to profile →
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 mt-6">
              <CardHeader className="">
                <CardTitle className="text-lg font-bold">
                  Application Checklist
                </CardTitle>
              </CardHeader>

              <CardContent className="-mt-6 pt-2">
                {applicationChecklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-1"
                  >
                    <CiCircleCheck size={20} />
                    <label>{item.label}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Helpful Resources */}
            <Card className="shadow-md  mt-6 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-bold">
                  Helpful Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-6">
                <Link
                  href="#"
                  className="block  rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="text-sm font-medium text-[#4F46E5]">
                    Tips for a Great Application
                  </div>
                </Link>
                <Link
                  href="#"
                  className="block rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="text-sm font-medium text-[#4F46E5]">
                    A2SV Problem Solving Guide
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
