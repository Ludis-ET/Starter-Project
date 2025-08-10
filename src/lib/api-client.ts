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
  email?: string;
  profile_picture?: File | null;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export const profileApi = {
  getProfile: (token: string): Promise<ApiResponse<Profile>> =>
    apiRequest('/profile/me', { method: 'GET' }, token),

  updateProfile: (
    data: UpdateProfileData,
    token: string
  ): Promise<ApiResponse<Profile>> => {
    const formData = new FormData();
    
    // Append only fields that exist
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.email) formData.append("email", data.email);
    if (data.profile_picture instanceof File) {
      formData.append("profile_picture", data.profile_picture);
    }

    return fetch(`${BASE_URL}/profile/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // no Content-Type here for FormData
      },
      body: formData,
    })
      .then(async (res) => {
        const responseData = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errorMsg =
            responseData?.message || `API Error: ${res.status}`;
          throw new Error(errorMsg);
        }
        return responseData;
      });
  },

  changePassword: (
    data: ChangePasswordData,
    token: string
  ): Promise<ApiResponse<any>> =>
    apiRequest(
      '/profile/me/change-password',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token
    ),
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
  activity_check_notes?: string;
  resume_score?: number;
  essay_why_a2sv_score?: number;
  essay_about_you_score?: number;
  technical_interview_score?: number;
  behavioral_interview_score?: number;
  interview_notes?: string;
}

export interface ApplicantDetails {
  id: string;
  applicant_name: string;
  status: string;
  school: string;
  student_id: string;
  country: string;
  degree: string;
  leetcode_handle: string;
  codeforces_handle: string;
  essay_why_a2sv: string;
  essay_about_you: string;
  resume_url: string;
  submitted_at: string;
  updated_at: string;
}

export interface ReviewDetails {
  id: string;
  application_id: string;
  reviewer_id: string;
  activity_check_notes: string;
  resume_score: number;
  essay_why_a2sv_score: number;
  essay_about_you_score: number;
  technical_interview_score: number;
  behavioral_interview_score: number;
  interview_notes: string;
  created_at: string;
  updated_at: string;
}

export interface FullApplicationReview {
  id: string;
  applicant_details: ApplicantDetails;
  review_details: ReviewDetails;
}

export const reviewsApi = {
  getAssignedReviews: (page = 1, limit = 10, token: string): Promise<PaginatedResponse<ReviewItem>> =>
    apiRequest(`/reviews/assigned/?page=${page}&limit=${limit}`, { method: 'GET' }, token),

  getReviewById: (applicationId: string, token: string): Promise<ApiResponse<FullApplicationReview>> =>
    apiRequest(`/reviews/${applicationId}/`, { method: 'GET' }, token),

  updateReview: (applicationId: string, data: ReviewUpdateData, token: string): Promise<ApiResponse<ReviewDetails>> =>
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
