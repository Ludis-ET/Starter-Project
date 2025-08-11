// src/lib/admin-api.ts
import { getServerSession } from "next-auth/next";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
import { options } from "@/app/api/auth/[...nextauth]/options";
import { useFetchWithAuth } from "@/utils/fetchWithAuth";

const fetchWithAuth = useFetchWithAuth();

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://a2sv-application-platform-backend-team5.onrender.com";

interface AnalyticsData {
  total_applicants: number;
  acceptance_rate: number;
  average_review_time_days: number;
  application_funnel: Record<string, number>;
  school_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  message: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  profile_picture: string;
  is_active: boolean;
}

interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

interface UserTmp {
  users: User[];
  limit: number;
  page: number;
  total_count: number;
}
interface UsersListResponse {
  success: boolean;
  data: UserTmp[];
  message: string;
}

interface UpdateUserData {
  full_name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}

interface Cycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  description: string;
}

interface CycleResponse {
  success: boolean;
  data: Cycle;
  message: string;
}

interface ListTmp {
  cycles: Cycle[];
  limit: number;
  page: 1;
  total_count: number;
}

interface CyclesListResponse {
  success: boolean;
  data: ListTmp;
  message: string;
}

interface CreateCycleData {
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface UpdateCycleData {
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/analytics/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store", // Ensure fresh data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.status}`);
  }

  return response.json();
}

export async function fetchUsers(): Promise<UsersListResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/users/?page=1&limit=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return response.json();
}

export async function fetchUserById(userId: string): Promise<UserResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/users/${userId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}

export async function updateUser(
  userId: string,
  userData: UpdateUserData
): Promise<UserResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/users/${userId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }

  return response.json();
}

export async function deleteUser(userId: string): Promise<UserResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/users/${userId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }

  return response.json();
}

export async function fetchCycles(): Promise<CyclesListResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/cycles/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cycles: ${response.status}`);
  }

  return response.json();
}

export async function createCycle(
  cycleData: CreateCycleData
): Promise<CycleResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/cycles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(cycleData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create cycle: ${response.status}`);
  }

  return response.json();
}

export async function updateCycle(
  cycleId: number,
  cycleData: UpdateCycleData
): Promise<CycleResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/cycles/${cycleId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(cycleData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update cycle: ${response.status}`);
  }

  return response.json();
}

export async function activateCycle(cycleId: number): Promise<CycleResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(
    `${BASE_URL}/admin/cycles/${cycleId}/activate/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to activate cycle: ${response.status}`);
  }

  return response.json();
}

export async function deleteCycle(cycleId: number): Promise<CycleResponse> {
  const session = await getServerSession(options);

  if (!session?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetchWithAuth(`${BASE_URL}/admin/cycles/${cycleId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete cycle: ${response.status}`);
  }

  return response.json();
}
