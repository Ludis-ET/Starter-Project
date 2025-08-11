"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { reviewsApi, ReviewItem } from "@/lib/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, FileText, Filter, Calendar } from "lucide-react";

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
      pending: {
        variant: "secondary" as const,
        label: "Pending Review",
        tooltip: "Application is waiting to be reviewed",
      },
      in_progress: {
        variant: "default" as const,
        label: "Under Review",
        tooltip: "Application is currently being reviewed",
      },
      completed: {
        variant: "destructive" as const,
        label: "Review Complete",
        tooltip: "Review process completed",
      },
      submitted: {
        variant: "secondary" as const,
        label: "Submitted",
        tooltip: "Application has been submitted",
      },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge
        variant={statusInfo.variant}
        title={statusInfo.tooltip}
        className="cursor-help select-none"
      >
        {statusInfo.label}
      </Badge>
    );
  };

  const filteredApps = applications.filter(
    (app) => filter === "All" || app.status === filter
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(itemsPerPage)].map((_, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <div className="flex space-x-3 items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
                <div className="h-8 bg-gray-300 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
              Assigned Applications
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              You have <span className="font-semibold">{totalCount}</span>{" "}
              applications waiting for your review.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 select-none">
            <Calendar className="w-5 h-5" />
            <span>Sorted by Submission Date</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {["All", "pending", "in_progress", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={`
                flex items-center
                transition-transform text-gray-600 border-0 duration-200  bg-gray-200
                ${
                  filter === status
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "hover:bg-blue-50"
                }
                ${filter === status ? "scale-105 shadow-lg text-white" : ""}
              `}
              aria-pressed={filter === status}
              aria-label={`Filter applications by ${
                status === "All" ? "all statuses" : status.replace("_", " ")
              }`}
            >
              <Filter className="w-4 h-4 mr-1" />
              {status === "All" ? "All" : status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <Card
            key={app.application_id}
            className="hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleReview(app.application_id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                handleReview(app.application_id);
            }}
            aria-label={`Start review for application ${app.applicant_name}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {app.applicant_name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 select-text">
                      Application ID: {app.application_id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Submitted: {formatDate(app.submission_date)}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-5 h-5" />
                <span className="bg-amber-200 rounded px-3 text-orange-900">
                  Ready for Review
                </span>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview(app.application_id);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-500 text-white"
              >
                Start Review
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border p-4 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600 select-none">
            Showing{" "}
            <span className="font-semibold">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, totalCount)}
            </span>{" "}
            of <span className="font-semibold">{totalCount}</span> applications
          </div>

          <nav
            aria-label="Pagination navigation"
            className="flex items-center space-x-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show only first 3 pages, last page, and pages near currentPage
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                    aria-current={currentPage === page ? "page" : undefined}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </Button>
                );
              }

              // Insert ellipsis if needed
              if (
                (page === 2 && currentPage > 4) ||
                (page === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                return (
                  <span key={page} className="px-2 select-none">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </nav>
        </div>
      )}

      {filteredApps.length === 0 && !loading && (
        <div className="text-center py-16 space-y-4">
          <FileText className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="text-2xl font-semibold text-gray-900">
            No applications found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === "All"
              ? "You don't have any applications assigned for review yet."
              : `No applications with status "${filter}" found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovedReviewerDashboard;
