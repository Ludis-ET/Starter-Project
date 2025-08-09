"use client";

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SetNewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  success: boolean;
  data?: string;
  message: string;
}

const SetNewPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SetNewPasswordFormData>({
    mode: 'onBlur',
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newPassword = watch('newPassword'); // Watch newPassword to compare with confirmPassword

  const onSubmit = async (data: SetNewPasswordFormData) => {
    if (!API_URL) {
      setIsSuccess(false);
      setApiMessage('API URL is not configured. Please contact support.');
      console.error('Error: NEXT_PUBLIC_API_URL is not defined');
      return;
    }

    if (!token) {
      setIsSuccess(false);
      setApiMessage('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setApiMessage(null);
    setIsSuccess(null);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: data.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      setIsSuccess(result.success);
      setApiMessage(result.message);

      if (result.success) {
        router.push('/success');
      } else {
        console.error('Error:', result.message);
      }
    } catch (error: any) {
      setIsSuccess(false);
      setApiMessage(error.message === 'Failed to fetch' ? 'Failed to connect to the server. Please try again later.' : 'An error occurred. Please try again.');
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Logo Section */}
        <div className="flex justify-center">
          <Link href="/">
            <Image src="/assets/Logo.png" alt="Logo" className="h-12 w-auto" width={120} height={48} priority />
          </Link>
        </div>

        {/* Form Title */}
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Set New Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please choose a strong new password for your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="********"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must include uppercase, lowercase, number, and special character',
                },
              })}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="********"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* API Response Message */}
          {apiMessage && (
            <p className={`text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {apiMessage}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !token}
              aria-disabled={isLoading || !token}
              aria-label="Set new password"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !token ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? 'Submitting...' : 'Set Password'}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center text-sm">
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordForm;