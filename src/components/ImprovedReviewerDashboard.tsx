"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { reviewsApi, ReviewItem } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Clock,
  FileText,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Assume your custom Card components are defined correctly here...
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl  py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

const ImprovedReviewerDashboard = () => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "in_progress" | "completed">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const itemsPerPage = 6;

  useEffect(() => {
    if (authStatus === "authenticated" && session?.accessToken) {
      fetchApplications();
    }
  }, [authStatus, session, currentPage, filter, sortOrder]);

  const fetchApplications = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      setError(null);

      // We still fetch from the API as normal. The API doesn't support filtering,
      // so we will filter the results on the client-side.
      const response = await reviewsApi.getAssignedReviews(
        currentPage,
        itemsPerPage,
        session.accessToken
      );

      let reviews = response.data.reviews || [];

      // --- CLIENT-SIDE FILTERING LOGIC ---
      let filteredReviews = reviews;
      if (filter !== "All") {
        filteredReviews = reviews.filter((app) => {
          if (filter === "in_progress") {
            return (
              app.status === "in_progress" || app.status === "pending_review"
            );
          }
          if (filter === "completed") {
            return app.status === "completed" || app.status === "accepted";
          }
          return false; // Should not happen
        });
      }

      // Client-side sorting
      filteredReviews.sort((a, b) => {
        const dateA = new Date(a.submission_date).getTime();
        const dateB = new Date(b.submission_date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });

      setApplications(filteredReviews);

      // WARNING: Total count will be for ALL items from the API, not the filtered count.
      // This is a limitation of client-side filtering with a paginated API.
      setTotalCount(response.data.total_count || 0);
      setTotalPages(Math.ceil((response.data.total_count || 0) / itemsPerPage));
    } catch (error: any) {
      console.error("Failed to fetch applications:", error);
      setError(
        error.message || "Failed to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    // When filtering on the client, we don't need to reset the page,
    // as we just re-filter the existing data. But it's better to fetch again
    // to ensure data is fresh. We reset to page 1 for consistency.
    setCurrentPage(1);
  };

  const handleReview = (applicationId: string) => {
    router.push(`/reviewer/review/${applicationId}`);
  };

  const getStatusBadge = (status: string) => {
    let displayStatus: "in_progress" | "completed" = "in_progress";
    if (status === "completed" || status === "accepted") {
      displayStatus = "completed";
    }

    const statusMap = {
      in_progress: {
        variant: "default" as const,
        label: "Under Review",
      },
      completed: {
        variant: "destructive" as const,
        label: "Review Complete",
      },
    };

    const statusInfo = statusMap[displayStatus];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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

  // --- Render Logic ---

  if (authStatus === "loading") {
    return <div className="text-center p-12">Authenticating...</div>;
  }

  if (authStatus === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">{error}</h2>
        <Button onClick={fetchApplications} className="mt-4">
          Retry
        </Button>
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
            <p className="text-gray-600 mt-2 text-lg" aria-live="polite">
              Displaying applications for your review.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center space-x-2 text-sm text-gray-600"
          >
            <Calendar className="w-5 h-5" />
            <span>
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
            {sortOrder === "desc" ? (
              <ArrowDown className="w-4 h-4" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-6 flex-wrap">
          {(["All", "in_progress", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(f)}
              className="capitalize"
            >
              <Filter className="w-4 h-4 mr-2" />
              {f.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => {
          const isCompleted =
            app.status === "completed" || app.status === "accepted";
          return (
            <Card
              key={app.application_id}
              className={`transition-shadow duration-300 ${
                !isCompleted
                  ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  : "bg-gray-50"
              }`}
              onClick={() => !isCompleted && handleReview(app.application_id)}
              tabIndex={isCompleted ? -1 : 0}
              role={isCompleted ? undefined : "button"}
              aria-label={
                isCompleted
                  ? `Application from ${app.applicant_name} is reviewed`
                  : `Start review for ${app.applicant_name}`
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle>{app.applicant_name}</CardTitle>
                      <CardDescription>
                        ID: {app.application_id.slice(0, 8)}...
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Submitted: {formatDate(app.submission_date)}</span>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCompleted) {
                      handleReview(app.application_id);
                    }
                  }}
                  disabled={isCompleted}
                  className={`w-full ${
                    isCompleted
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isCompleted ? "Reviewed" : "Start Review"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State for Filtered Results */}
      {applications.length === 0 && !loading && (
        <div className="text-center py-16 col-span-full">
          <FileText className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold">No applications found</h3>
          <p className="text-gray-500 mt-2">
            {filter === "All"
              ? "No applications are assigned to you on this page."
              : `No applications matching the "${filter.replace(
                  "_",
                  " "
                )}" filter were found on this page.`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ImprovedReviewerDashboard;
