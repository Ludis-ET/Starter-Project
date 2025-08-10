// src/lib/api-client.ts
import { getAccessToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://a2sv-application-platform-backend-team5.onrender.com';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    total_count: number;
    page: number;
    limit: number;
  };
  message: string;
}

const createHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}, 
  token?: string
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = createHeaders(token);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
};

// Profile API
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  profile_picture_url: string;
}

export interface UpdateProfileData {
  full_name?: string;
  profile_picture_url?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const profileApi = {
  getProfile: (token: string): Promise<ApiResponse<Profile>> =>
    apiRequest('/profile/me', { method: 'GET' }, token),
    
  updateProfile: (data: UpdateProfileData, token: string): Promise<ApiResponse<Profile>> =>
    apiRequest('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),
    
  changePassword: (data: ChangePasswordData, token: string): Promise<ApiResponse<any>> =>
    apiRequest('/profile/me/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),
};

// Reviews API
export interface ReviewItem {
  application_id: string;
  applicant_name: string;
  status: string;
  submission_date: string;
}

export interface ApplicationReview {
  id: string;
  applicant_id: string;
  applicant_name: string;
  school: string;
  degree: string;
  country: string;
  essay_why_a2sv: string;
  essay_about_you: string;
  leetcode_handle?: string;
  codeforces_handle?: string;
  resume_url?: string;
  status: string;
  submitted_at: string;
}

export interface ReviewUpdateData {
  score: number;
  feedback: string;
  status: 'approved' | 'rejected' | 'pending';
}

export const reviewsApi = {
  getAssignedReviews: (page = 1, limit = 10, token: string): Promise<PaginatedResponse<ReviewItem>> =>
    apiRequest(`/reviews/assigned/?page=${page}&limit=${limit}`, { method: 'GET' }, token),
    
  getReviewById: (applicationId: string, token: string): Promise<ApiResponse<ApplicationReview>> =>
    apiRequest(`/reviews/${applicationId}/`, { method: 'GET' }, token),
    
  updateReview: (applicationId: string, data: ReviewUpdateData, token: string): Promise<ApiResponse<any>> =>
    apiRequest(`/reviews/${applicationId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),
};

// Cycles API
export interface Cycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  description: string;
}

export const cyclesApi = {
  getAllCycles: (page = 1, limit = 10, token: string): Promise<PaginatedResponse<Cycle>> =>
    apiRequest(`/cycles/?page=${page}&limit=${limit}`, { method: 'GET' }, token),
    
  getActiveCycles: (token: string): Promise<ApiResponse<Cycle[]>> =>
    apiRequest('/cycles/active/', { method: 'GET' }, token),
    
  getCycleById: (cycleId: number, token: string): Promise<ApiResponse<Cycle>> =>
    apiRequest(`/cycles/${cycleId}/`, { method: 'GET' }, token),
};

// Applications API
export interface ApplicationStatus {
  id: string;
  status: string;
  school: string;
  country: string;
  degree: string;
  submitted_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  school: string;
  degree: string;
  country: string;
  essay_why_a2sv: string;
  essay_about_you: string;
  leetcode_handle?: string;
  codeforces_handle?: string;
  resume_url?: string;
  status: string;
  submitted_at: string;
}

export interface ApplicationUpdateData {
  school?: string;
  degree?: string;
  country?: string;
  essay_why_a2sv?: string;
  essay_about_you?: string;
  leetcode_handle?: string;
  codeforces_handle?: string;
  resume_url?: string;
}

export const applicationsApi = {
  getMyStatus: (token: string): Promise<ApiResponse<ApplicationStatus>> =>
    apiRequest('/applications/my-status/', { method: 'GET' }, token),
    
  getApplication: (applicationId: string, token: string): Promise<ApiResponse<Application>> =>
    apiRequest(`/applications/${applicationId}/`, { method: 'GET' }, token),
    
  updateApplication: (applicationId: string, data: ApplicationUpdateData, token: string): Promise<ApiResponse<Application>> =>
    apiRequest(`/applications/${applicationId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),
    
  deleteApplication: (applicationId: string, token: string): Promise<ApiResponse<any>> =>
    apiRequest(`/applications/${applicationId}/`, { method: 'DELETE' }, token),
    
  submitApplication: (applicationId: string, token: string): Promise<ApiResponse<any>> =>
    apiRequest(`/applications/${applicationId}/`, { method: 'PATCH' }, token),
};

// Utility function to get token from session
export const getTokenFromSession = (session: any): string | null => {
  return session?.accessToken || null;
};

// Hook-based API calls (for use with React hooks)
export const createApiHooks = () => {
  const useApiCall = <T>(
    apiCall: (token: string) => Promise<T>,
    dependencies: any[] = []
  ) => {
    // This would typically use SWR or React Query for better caching and state management
    // For now, this is a placeholder for the pattern
    return {
      data: null,
      loading: false,
      error: null,
      mutate: () => {},
    };
  };

  return {
    useProfile: (token: string) => useApiCall(() => profileApi.getProfile(token)),
    useAssignedReviews: (token: string, page = 1, limit = 10) => 
      useApiCall(() => reviewsApi.getAssignedReviews(page, limit, token)),
    useApplicationStatus: (token: string) => 
      useApiCall(() => applicationsApi.getMyStatus(token)),
    useCycles: (token: string, page = 1, limit = 10) => 
      useApiCall(() => cyclesApi.getAllCycles(page, limit, token)),
  };
};
