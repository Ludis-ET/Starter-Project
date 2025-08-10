"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { reviewsApi, FullApplicationReview, ReviewUpdateData } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { ArrowLeft, User, School, Globe, FileText, ExternalLink } from 'lucide-react';

interface ApplicationReviewDetailProps {
  applicationId: string;
}

const ApplicationReviewDetail = ({ applicationId }: ApplicationReviewDetailProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviewData, setReviewData] = useState<FullApplicationReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [evaluationForm, setEvaluationForm] = useState({
    activity_check_notes: '',
    resume_score: 0,
    essay_why_a2sv_score: 0,
    essay_about_you_score: 0,
    technical_interview_score: 0,
    behavioral_interview_score: 0,
    interview_notes: ''
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchReviewData();
    }
  }, [session, applicationId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const response = await reviewsApi.getReviewById(applicationId, session!.accessToken);
      setReviewData(response.data);
      
      // Initialize form with existing review data if available
      if (response.data.review_details) {
        setEvaluationForm({
          activity_check_notes: response.data.review_details.activity_check_notes || '',
          resume_score: response.data.review_details.resume_score || 0,
          essay_why_a2sv_score: response.data.review_details.essay_why_a2sv_score || 0,
          essay_about_you_score: response.data.review_details.essay_about_you_score || 0,
          technical_interview_score: response.data.review_details.technical_interview_score || 0,
          behavioral_interview_score: response.data.review_details.behavioral_interview_score || 0,
          interview_notes: response.data.review_details.interview_notes || ''
        });
      }
    } catch (err) {
      setError('Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const updateData: ReviewUpdateData = evaluationForm;
      await reviewsApi.updateReview(applicationId, updateData, session.accessToken);
      setMessage('Review submitted successfully');
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof evaluationForm, value: string | number) => {
    setEvaluationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, label: "Pending Review" },
      in_progress: { variant: "default" as const, label: "Under Review" },
      completed: { variant: "destructive" as const, label: "Review Complete" },
      submitted: { variant: "secondary" as const, label: "Submitted" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Application not found</p>
      </div>
    );
  }

  const { applicant_details } = reviewData;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review: {applicant_details.applicant_name}</h1>
            <p className="text-gray-600">Application Review and Evaluation</p>
          </div>
        </div>
        {getStatusBadge(applicant_details.status)}
      </div>

      {/* Messages */}
      {message && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          {message}
        </Alert>
      )}
      {error && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicant Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Applicant Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="text-sm text-gray-900">{applicant_details.applicant_name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <School className="w-3 h-3 mr-1" />
                    School
                  </Label>
                  <p className="text-sm text-gray-900">{applicant_details.school}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Student ID</Label>
                  <p className="text-sm text-gray-900">{applicant_details.student_id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    Country
                  </Label>
                  <p className="text-sm text-gray-900">{applicant_details.country}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Degree</Label>
                  <p className="text-sm text-gray-900">{applicant_details.degree}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">LeetCode</Label>
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {applicant_details.leetcode_handle || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Codeforces</Label>
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {applicant_details.codeforces_handle || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Essay: Why A2SV?</Label>
                <div className="bg-gray-50 p-3 rounded-md mt-1 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-900">{applicant_details.essay_why_a2sv}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Essay: About You</Label>
                <div className="bg-gray-50 p-3 rounded-md mt-1 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-900">{applicant_details.essay_about_you}</p>
                </div>
              </div>
              
              {applicant_details.resume_url && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Resume</Label>
                  <a 
                    href={applicant_details.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline mt-1"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    View Resume
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Submitted</Label>
                <p className="text-sm text-gray-900">{formatDate(applicant_details.submitted_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Form</CardTitle>
            <CardDescription>Assess the application and provide scores</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="activity_check_notes">Activity Check Notes</Label>
                <Input
                  id="activity_check_notes"
                  value={evaluationForm.activity_check_notes}
                  onChange={(e) => handleInputChange('activity_check_notes', e.target.value)}
                  placeholder="Notes on coding activity verification"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="resume_score">Resume Score</Label>
                  <Input
                    id="resume_score"
                    type="number"
                    min="0"
                    max="100"
                    value={evaluationForm.resume_score}
                    onChange={(e) => handleInputChange('resume_score', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="essay_why_a2sv_score">Essay A2SV Score</Label>
                  <Input
                    id="essay_why_a2sv_score"
                    type="number"
                    min="0"
                    max="100"
                    value={evaluationForm.essay_why_a2sv_score}
                    onChange={(e) => handleInputChange('essay_why_a2sv_score', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="essay_about_you_score">Essay About You Score</Label>
                  <Input
                    id="essay_about_you_score"
                    type="number"
                    min="0"
                    max="100"
                    value={evaluationForm.essay_about_you_score}
                    onChange={(e) => handleInputChange('essay_about_you_score', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="technical_interview_score">Technical Score</Label>
                  <Input
                    id="technical_interview_score"
                    type="number"
                    min="0"
                    max="100"
                    value={evaluationForm.technical_interview_score}
                    onChange={(e) => handleInputChange('technical_interview_score', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="behavioral_interview_score">Behavioral Interview Score</Label>
                <Input
                  id="behavioral_interview_score"
                  type="number"
                  min="0"
                  max="100"
                  value={evaluationForm.behavioral_interview_score}
                  onChange={(e) => handleInputChange('behavioral_interview_score', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="interview_notes">Interview Notes</Label>
                <textarea
                  id="interview_notes"
                  value={evaluationForm.interview_notes}
                  onChange={(e) => handleInputChange('interview_notes', e.target.value)}
                  placeholder="Additional notes and feedback"
                  className="w-full p-2 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? 'Saving Review...' : 'Save & Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationReviewDetail;
