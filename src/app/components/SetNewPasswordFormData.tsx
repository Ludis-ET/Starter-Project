"use client";

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';

interface SetNewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
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

  const newPassword = watch('newPassword'); // Watch newPassword to compare with confirmPassword

  const onSubmit = (data: SetNewPasswordFormData) => {
    console.log('New password set:', data);
    // Replace with your API call to update the password
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set Password
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