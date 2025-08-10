"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users, 
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { reviewsApi, getTokenFromSession, ReviewItem } from "@/lib/api-client";
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

export default function ReviewerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  
  // Derived data
  const totalPages = Math.ceil(totalCount / limit);
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.applicant_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || review.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status.toLowerCase() === 'pending').length,
    approved: reviews.filter(r => r.status.toLowerCase() === 'approved').length,
    rejected: reviews.filter(r => r.status.toLowerCase() === 'rejected').length,
  };

  // Fetch assigned reviews
  const fetchReviews = async (page = 1) => {
    if (status !== "authenticated" || !session) return;
    
    try {
      setLoading(true);
      const token = getTokenFromSession(session);
      if (!token) throw new Error("No access token");
      
      const response = await reviewsApi.getAssignedReviews(page, limit, token);
      setReviews(response.data.reviews || []);
      setTotalCount(response.data.total_count || 0);
      setCurrentPage(response.data.page || 1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    fetchReviews(currentPage);
  }, [session, status, router, currentPage]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            
            {/* Stats Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Table Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assigned Applications</h1>
              <p className="text-gray-600 mt-1">Review and evaluate submitted applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => fetchReviews(currentPage)}>
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by applicant name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Applications ({filteredReviews.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "No applications have been assigned to you yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.application_id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-lg">
                        {review.applicant_name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {review.applicant_name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Submitted {formatDate(review.submission_date)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <StatusBadge status={review.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Link href={`/review/${review.application_id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          {review.status.toLowerCase() === 'pending' ? 'Review' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * limit + 1, totalCount)} to{' '}
              {Math.min(currentPage * limit, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
