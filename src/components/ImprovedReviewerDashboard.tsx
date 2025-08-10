"use client";

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { reviewsApi, ReviewItem } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Clock, FileText, Filter, Calendar } from 'lucide-react';

const ImprovedReviewerDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    if (session?.accessToken) {
      fetchApplications();
    }
  }, [session, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await reviewsApi.getAssignedReviews(
        currentPage, 
        itemsPerPage, 
        session!.accessToken
      );
      
      setApplications(response.data.reviews || []);
      setTotalCount(response.data.total_count || 0);
      setTotalPages(Math.ceil((response.data.total_count || 0) / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (applicationId: string) => {
    router.push(`/reviewer/review/${applicationId}`);
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

  const filteredApps = applications.filter(
    (app) => filter === "All" || app.status === filter
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assigned Applications</h1>
            <p className="text-gray-600 mt-1">
              You have {totalCount} applications waiting for your review.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Sort by Submission Date</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {["All", "pending", "in_progress", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Filter className="w-3 h-3 mr-1" />
              {status === "All" ? "All" : status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <Card key={app.application_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{app.applicant_name}</CardTitle>
                    <CardDescription className="text-sm">
                      Application ID: {app.application_id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Submitted: {formatDate(app.submission_date)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Ready for Review</span>
              </div>

              <Button 
                onClick={() => handleReview(app.application_id)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Review
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} applications
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {filteredApps.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {filter === "All" 
              ? "You don't have any applications assigned for review yet."
              : `No applications with status "${filter}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovedReviewerDashboard;
