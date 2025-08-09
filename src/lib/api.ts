// src/lib/api.ts
import { getAccessToken } from './auth';

const BASE_URL = 'https://a2sv-application-platform-backend-team5.onrender.com';

const authHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const fetchAssignedReviews = async () => {
  const res = await fetch(`${BASE_URL}/reviews/assigned/?page=1&limit=10`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch assigned applications');
  return res.json();
};

export const fetchReviewById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/reviews/${id}/`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error('Failed to fetch review');
  return res.json();
};

export const submitReview = async (id: string, data: any) => {
  const res = await fetch(`${BASE_URL}/reviews/${id}/`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
};
