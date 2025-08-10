"use client";

import ApplicantNav from "@/app/components/ApplicantNav";
import React, { useEffect, useState } from "react";
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
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";

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
      id: "account",
      label: "Create an Account",
      completed: !!profileData?.full_name && !!profileData?.email,
      description: "Complete your basic account setup"
    },
    {
      id: "personal",
      label: "Fill Personal Information",
      completed: !!applicationData?.school && !!applicationData?.degree,
      description: "Add your educational background"
    },
    {
      id: "profiles",
      label: "Submit Coding Profiles",
      completed:
        !!applicationData?.leetcode_handle ||
        !!applicationData?.codeforces_handle,
      description: "Link your coding profiles"
    },
    {
      id: "essays",
      label: "Write Essays",
      completed:
        !!applicationData?.essay_why_a2sv && !!applicationData?.essay_about_you,
      description: "Complete application essays"
    },
    {
      id: "resume",
      label: "Upload Resume",
      completed: !!applicationData?.resume_url,
      description: "Upload your professional resume"
    },
  ];

  const completedApplicationItems = applicationChecklistItems.filter(item => item.completed).length;
  const applicationProgress = Math.round((completedApplicationItems / applicationChecklistItems.length) * 100);

  if (loadingProfile || loadingApp || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicantNav />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {profileData?.full_name || "John"}!
            </h1>
            <p className="text-gray-600 text-lg">
              Your journey as a global tech career starts here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Application Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">
                    G7 November Intake
                  </CardTitle>
                  <CardDescription className="text-indigo-100 text-base">
                    It's time to submit your application and show us your potential.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Button 
                      asChild
                      className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3"
                    >
                      <Link href="/applicant/Apply">Start Application</Link>
                    </Button>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Application Progress</div>
                      <div className="text-2xl font-bold">{applicationProgress}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Checklist */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Application Checklist
                  </CardTitle>
                  <CardDescription>
                    Complete all steps to submit your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applicationChecklistItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                        item.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                      <Badge 
                        variant={item.completed ? "default" : "secondary"}
                        className={
                          item.completed 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : ""
                        }
                      >
                        {item.completed ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <Badge
                        variant={isProfileComplete ? "default" : "secondary"}
                        className={
                          isProfileComplete
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                        }
                      >
                        {profileCompletionPercentage}% complete
                      </Badge>
                    </div>
                    <Progress
                      value={profileCompletionPercentage}
                      className="h-2"
                    />
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium group"
                  >
                    Go to profile 
                    <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </CardContent>
              </Card>

              {/* Helpful Resources */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    Helpful Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href="#"
                    className="block p-3 rounded-lg hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Tips for a Great Application
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Learn how to make your application stand out
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="block p-3 rounded-lg hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      A2SV Problem Solving Guide
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Prepare for technical assessments
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="block p-3 rounded-lg hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Interview Preparation
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Get ready for your interviews
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/applicant/Apply">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Continue Application
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="#">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Application Status
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
