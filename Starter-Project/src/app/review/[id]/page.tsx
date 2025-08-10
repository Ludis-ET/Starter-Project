"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  MapPin, 
  FileText, 
  Code, 
  Download,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Send
} from "lucide-react";
import { reviewsApi, getTokenFromSession, ApplicationReview, ReviewUpdateData } from "@/lib/api-client";
import Link from "next/link";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} font-medium`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </Badge>
  );
};

export default function ReviewDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  
  // State management
  const [application, setApplication] = useState<ApplicationReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    score: 0,
    feedback: "",
    status: "pending" as "approved" | "rejected" | "pending"
  });

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      if (status !== "authenticated" || !session || !applicationId) return;
      
      try {
        setLoading(true);
        const token = getTokenFromSession(session);
        if (!token) throw new Error("No access token");
        
        const response = await reviewsApi.getReviewById(applicationId, token);
        setApplication(response.data);
      } catch (error) {
        console.error("Error fetching application:", error);
        setMessage({ type: 'error', text: 'Failed to load application details' });
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    fetchApplication();
  }, [session, status, router, applicationId]);

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !application) return;

    if (reviewForm.score < 1 || reviewForm.score > 10) {
      setMessage({ type: 'error', text: 'Score must be between 1 and 10' });
      return;
    }

    if (!reviewForm.feedback.trim()) {
      setMessage({ type: 'error', text: 'Feedback is required' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const token = getTokenFromSession(session);
      if (!token) throw new Error("No access token");

      const reviewData: ReviewUpdateData = {
        score: reviewForm.score,
        feedback: reviewForm.feedback,
        status: reviewForm.status,
      };

      await reviewsApi.updateReview(application.id, reviewData, token);
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      
      // Refresh application data
      const response = await reviewsApi.getReviewById(applicationId, token);
      setApplication(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage({ type: 'error', text: 'Failed to submit review' });
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load the application details.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Review: {application.applicant_name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <StatusBadge status={application.status} />
                <span className="text-sm text-gray-600">
                  Submitted {formatDate(application.submitted_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Applicant Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                    <p className="text-lg font-semibold text-gray-900">{application.applicant_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Country</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{application.country}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">School/University</Label>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{application.school}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Degree</Label>
                    <p className="text-gray-900">{application.degree}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coding Profiles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Coding Profiles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">LeetCode Handle</Label>
                    <p className="text-gray-900">{application.leetcode_handle || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Codeforces Handle</Label>
                    <p className="text-gray-900">{application.codeforces_handle || "Not provided"}</p>
                  </div>
                </div>
                
                {application.resume_url && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Resume</Label>
                      <div className="mt-2">
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Resume</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Essays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Essays</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Why do you want to join A2SV?
                  </Label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {application.essay_why_a2sv}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Tell us about yourself
                  </Label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {application.essay_about_you}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evaluation Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Evaluation Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Score */}
                  <div className="space-y-2">
                    <Label htmlFor="score">
                      Overall Score (1-10)
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min="1"
                      max="10"
                      value={reviewForm.score || ""}
                      onChange={(e) => setReviewForm({ ...reviewForm, score: parseInt(e.target.value) || 0 })}
                      placeholder="Rate from 1 to 10"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      1 = Poor, 5 = Average, 10 = Excellent
                    </p>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      Detailed Feedback
                    </Label>
                    <textarea
                      id="feedback"
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      placeholder="Provide detailed feedback on the application..."
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Decision */}
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Decision
                    </Label>
                    <select
                      id="status"
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approve Application</option>
                      <option value="rejected">Reject Application</option>
                    </select>
                  </div>

                  <Separator />

                  {/* Submit Buttons */}
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Review...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.back()}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
