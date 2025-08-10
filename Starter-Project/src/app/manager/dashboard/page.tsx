"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Calendar, 
  Settings, 
  Plus, 
  Search, 
  Edit,
  Eye,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter
} from "lucide-react";
import { cyclesApi, getTokenFromSession, Cycle } from "@/lib/api-client";
import Link from "next/link";

const CycleStatusBadge = ({ cycle }: { cycle: Cycle }) => {
  const now = new Date();
  const startDate = new Date(cycle.start_date);
  const endDate = new Date(cycle.end_date);
  
  let status: 'upcoming' | 'active' | 'ended';
  let config;
  
  if (now < startDate) {
    status = 'upcoming';
    config = { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Upcoming' };
  } else if (now >= startDate && now <= endDate) {
    status = 'active';
    config = { color: 'bg-green-100 text-green-800', icon: CheckCircle2, text: 'Active' };
  } else {
    status = 'ended';
    config = { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Ended' };
  }
  
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} font-medium`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Derived data
  const totalPages = Math.ceil(totalCount / limit);
  const filteredCycles = cycles.filter((cycle) => {
    const matchesSearch = cycle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cycle.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    const now = new Date();
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);
    
    let cycleStatus: string;
    if (now < startDate) cycleStatus = 'upcoming';
    else if (now >= startDate && now <= endDate) cycleStatus = 'active';
    else cycleStatus = 'ended';
    
    return matchesSearch && cycleStatus === filterStatus;
  });

  // Stats
  const stats = {
    total: cycles.length,
    active: cycles.filter(c => {
      const now = new Date();
      const startDate = new Date(c.start_date);
      const endDate = new Date(c.end_date);
      return now >= startDate && now <= endDate;
    }).length,
    upcoming: cycles.filter(c => new Date() < new Date(c.start_date)).length,
    ended: cycles.filter(c => new Date() > new Date(c.end_date)).length,
  };

  // Fetch cycles
  const fetchCycles = async (page = 1) => {
    if (status !== "authenticated" || !session) return;
    
    try {
      setLoading(true);
      const token = getTokenFromSession(session);
      if (!token) throw new Error("No access token");
      
      const response = await cyclesApi.getAllCycles(page, limit, token);
      setCycles(response.data.cycles || []);
      setTotalCount(response.data.total_count || 0);
      setCurrentPage(response.data.page || 1);
    } catch (error) {
      console.error("Error fetching cycles:", error);
      setMessage({ type: 'error', text: 'Failed to load cycles' });
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
    
    fetchCycles(currentPage);
  }, [session, status, router, currentPage]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate days until start/end
  const getDaysInfo = (cycle: Cycle) => {
    const now = new Date();
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);
    
    if (now < startDate) {
      const days = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (now >= startDate && now <= endDate) {
      const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Ends in ${days} day${days !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Ended ${days} day${days !== 1 ? 's' : ''} ago`;
    }
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
                    <div key={i} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage application cycles and system settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/cycles/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Cycle
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cycles</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cycles</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
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
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.ended}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">View application statistics</p>
                </div>
              </div>
              <Link href="/admin/analytics" className="mt-4 block">
                <Button variant="outline" className="w-full">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">Manage system users</p>
                </div>
              </div>
              <Link href="/admin/users" className="mt-4 block">
                <Button variant="outline" className="w-full">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">System Settings</h3>
                  <p className="text-sm text-gray-600">Configure application</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
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
                    placeholder="Search cycles by name or description..."
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
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cycles List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Application Cycles ({filteredCycles.length})</span>
              </div>
              <Link href="/admin/cycles/new">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cycle
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCycles.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cycles found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || filterStatus !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Create your first application cycle to get started"}
                </p>
                <Link href="/admin/cycles/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Cycle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
                          <CycleStatusBadge cycle={cycle} />
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{cycle.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>
                            <strong>Start:</strong> {formatDate(cycle.start_date)}
                          </span>
                          <span>
                            <strong>End:</strong> {formatDate(cycle.end_date)}
                          </span>
                          <span>{getDaysInfo(cycle)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/admin/cycles/${cycle.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/cycles/${cycle.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
