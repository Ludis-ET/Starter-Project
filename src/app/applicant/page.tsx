"use client";

import ApplicantNav from "@/components/app/ApplicantNav";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Calendar,
  FileText,
  User,
  Award,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Coffee
} from "lucide-react";
import { 
  profileApi, 
  applicationsApi, 
  getTokenFromSession, 
  Profile, 
  ApplicationStatus 
} from "@/lib/api-client";
import { Label } from "@/components/ui/label";

// Timeline component for application progress
const ApplicationTimeline = ({ status }: { status: string }) => {
  const steps = [
    { id: 'submitted', label: 'Application Submitted', icon: FileText },
    { id: 'review', label: 'Under Review', icon: Clock },
    { id: 'interview', label: 'Interview Stage', icon: User },
    { id: 'decision', label: 'Final Decision', icon: Award },
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const statusMap: Record<string, number> = {
      'submitted': 1,
      'pending': 1,
      'under_review': 2,
      'interview': 3,
      'approved': 4,
      'rejected': 4,
    };

    const currentStep = statusMap[currentStatus.toLowerCase()] || 0;
    const stepNumber = statusMap[stepId] || 0;

    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id, status);
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="flex items-center space-x-4">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-2
              ${stepStatus === 'completed' ? 'bg-green-500 border-green-500 text-white' : 
                stepStatus === 'current' ? 'bg-indigo-500 border-indigo-500 text-white' : 
                'bg-gray-100 border-gray-300 text-gray-400'}
            `}>
              {stepStatus === 'completed' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <p className={`font-medium ${
                stepStatus === 'completed' ? 'text-green-700' :
                stepStatus === 'current' ? 'text-indigo-700' :
                'text-gray-500'
              }`}>
                {step.label}
              </p>
              
              {stepStatus === 'current' && (
                <p className="text-sm text-gray-600">Currently in progress</p>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-px h-8 ml-5 ${
                stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Under Review' };
      case 'under_review':
        return { color: 'bg-blue-100 text-blue-800', icon: FileText, text: 'In Review' };
      case 'interview':
        return { color: 'bg-purple-100 text-purple-800', icon: User, text: 'Interview Stage' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle2, text: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Not Selected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Pending' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} font-medium`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

export default function ApplicantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingApplication, setLoadingApplication] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session) return;
      
      try {
        const token = getTokenFromSession(session);
        if (!token) throw new Error("No access token");
        
        const response = await profileApi.getProfile(token);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoadingProfile(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    fetchProfile();
  }, [session, status, router]);

  // Fetch application status
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (status !== "authenticated" || !session) return;
      
      try {
        const token = getTokenFromSession(session);
        if (!token) throw new Error("No access token");
        
        const response = await applicationsApi.getMyStatus(token);
        setApplicationStatus(response.data);
      } catch (error) {
        console.error("Error fetching application status:", error);
        // This is expected if no application exists yet
      } finally {
        setLoadingApplication(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    fetchApplicationStatus();
  }, [session, status, router]);

  // Calculate profile completion
  const getProfileCompletion = () => {
    if (!profileData) return 0;
    
    const fields = [
      profileData.full_name,
      profileData.email,
      profileData.profile_picture_url,
    ];
    
    const completed = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loadingProfile || loadingApplication || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ApplicantNav />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
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

  const profileCompletion = getProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicantNav />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profileData?.full_name || "there"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Your journey to join A2SV continues here. Track your progress and next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Status Card */}
            {applicationStatus ? (
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-indigo-900">Application Status</CardTitle>
                      <CardDescription className="text-indigo-700">
                        Submitted on {formatDate(applicationStatus.submitted_at)}
                      </CardDescription>
                    </div>
                    <StatusBadge status={applicationStatus.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-indigo-700 font-medium">School</Label>
                        <p className="text-indigo-900">{applicationStatus.school}</p>
                      </div>
                      <div>
                        <Label className="text-indigo-700 font-medium">Degree</Label>
                        <p className="text-indigo-900">{applicationStatus.degree}</p>
                      </div>
                      <div>
                        <Label className="text-indigo-700 font-medium">Country</Label>
                        <p className="text-indigo-900">{applicationStatus.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-indigo-700">
                        Application ID: <span className="font-mono">{applicationStatus.id}</span>
                      </div>
                      <Button variant="outline" className="border-indigo-300 text-indigo-700">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Join Africa's most exclusive tech program and fast-track your career.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 mb-4">
                        The G7 November intake is now open for applications.
                      </p>
                      <Button asChild className="bg-white text-indigo-600 hover:bg-gray-100">
                        <Link href="/applicant/Apply">
                          <Zap className="w-4 h-4 mr-2" />
                          Start Application
                        </Link>
                      </Button>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-right">
                        <div className="text-3xl font-bold">G7</div>
                        <div className="text-sm opacity-90">November Intake</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Timeline */}
            {applicationStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Application Progress</span>
                  </CardTitle>
                  <CardDescription>
                    Track your application journey through our selection process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ApplicationTimeline status={applicationStatus.status} />
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                      <p className="text-2xl font-bold text-gray-900">{profileCompletion}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Days Since Apply</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {applicationStatus 
                          ? Math.floor((new Date().getTime() - new Date(applicationStatus.submitted_at).getTime()) / (1000 * 60 * 60 * 24))
                          : 0
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">
                        {applicationStatus?.status.replace('_', ' ') || 'Not Started'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <Badge variant={profileCompletion === 100 ? "default" : "secondary"}>
                      {profileCompletion}% complete
                    </Badge>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!applicationStatus ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Submit Your Application</p>
                        <p className="text-sm text-gray-600">Complete and submit your A2SV application</p>
                      </div>
                    </div>
                    <Link href="/applicant/Apply" className="block">
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Start Application
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Application Submitted</p>
                        <p className="text-sm text-gray-600">We're reviewing your application</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Prepare for Interview</p>
                        <p className="text-sm text-gray-600">Practice coding problems and review algorithms</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Helpful Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Helpful Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">Interview Guide</p>
                      <p className="text-sm text-gray-600">Prepare for technical interviews</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">Alumni Stories</p>
                      <p className="text-sm text-gray-600">Success stories from graduates</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">Problem Solving</p>
                      <p className="text-sm text-gray-600">Practice coding challenges</p>
                    </div>
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
