"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
// Assuming your hook is in a 'hooks' directory
import { useFetchWithAuth } from "@/utils/fetchWithAuth";

// A simple camera icon component for the upload button
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function ProfilePage() {
  const { data: session } = useSession();
  // Get the authorized fetch function from your custom hook
  const fetchWithAuth = useFetchWithAuth();

  // --- STATE MANAGEMENT ---
  const [profile, setProfile] = useState({
    full_name: "Loading...",
    email: "Loading...",
    role: "Loading...",
    profile_picture_url: null,
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- API AND DATA HANDLING ---

  // Fetches profile data using the authorized fetch function
  const fetchProfile = useCallback(async () => {
    // The hook will handle the unauthenticated state, but we can return early
    if (!session) return;

    try {
      // Use fetchWithAuth, no headers needed for a simple GET request
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/me`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setProfile(data.data);
        setFormData((prev) => ({
          ...prev,
          full_name: data.data.full_name,
          email: data.data.email,
        }));
        setImagePreview(data.data.profile_picture_url);
      } else {
        setError(data.message || "Failed to fetch profile.");
      }
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      // The hook will redirect on auth errors, but we catch other network issues
      setError("An error occurred while fetching your profile.");
    }
  }, [session, fetchWithAuth]); // Added fetchWithAuth to dependency array

  useEffect(() => {
    if (session) {
      // Only fetch if the session exists
      fetchProfile();
    }
  }, [session, fetchProfile]);

  // --- EVENT HANDLERS ---

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfilePictureFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const body = new FormData();
    body.append("full_name", formData.full_name);
    body.append("email", formData.email);
    if (profilePictureFile) {
      body.append("profile_picture", profilePictureFile);
    }

    try {
      // Use fetchWithAuth. We only specify the method and body.
      // The hook handles Authorization, and the browser handles Content-Type for FormData.
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/me`,
        {
          method: "PUT",
          body: body,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Profile updated successfully!");
        setProfilePictureFile(null);
        await fetchProfile(); // Re-fetch to ensure UI is in sync
      } else {
        const errorMsg =
          data.detail?.[0]?.msg || data.message || "Failed to update profile.";
        setError(errorMsg);
        setImagePreview(profile.profile_picture_url);
      }
    } catch (err) {
      console.error("Update Profile Error:", err);
      setError("An error occurred while updating your profile.");
    }
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords do not match.");
    }
    if (!formData.currentPassword || !formData.newPassword) {
      return setError("All password fields are required.");
    }

    try {
      // Use fetchWithAuth, providing only the non-auth headers
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/me/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: formData.currentPassword,
            new_password: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Password changed successfully!");
        setEditPasswordMode(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const errorMsg =
          data.detail?.[0]?.msg || data.message || "Failed to change password.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Change Password Error:", err);
      setError("An error occurred while changing your password.");
    }
  };

  const togglePasswordEdit = () => {
    setEditPasswordMode(!editPasswordMode);
    setError("");
    setSuccess("");
  };

  // --- RENDER ---
  // The JSX remains the same as the previous version.
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center gap-10 w-full max-w-[896px]">
        {/* Profile Header */}
        <div className="flex flex-col items-center w-full max-w-[832px]">
          <div
            className="w-full h-[192px] bg-gray-300 rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                imagePreview ||
                "https://via.placeholder.com/832x192/e2e8f0/64748b?text=Banner"
              })`,
            }}
          />
          <div className="flex items-end w-full max-w-[768px] mt-[-64px]">
            <div className="relative w-[128px] h-[128px] flex-shrink-0">
              <div
                className="w-[128px] h-[128px] bg-gray-200 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    imagePreview ||
                    "https://via.placeholder.com/128/e2e8f0/64748b?text=Avatar"
                  })`,
                  boxShadow: "0 0 0 4px #FFFFFF",
                }}
              />
              <label
                htmlFor="profile_picture_upload"
                className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <CameraIcon />
                <input
                  id="profile_picture_upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="flex flex-col items-start p-6 w-full">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {profile.full_name}
              </h1>
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-[832px] bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-start p-6 gap-6 w-full">
            {error && (
              <p className="w-full text-center p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </p>
            )}
            {success && (
              <p className="w-full text-center p-3 bg-green-100 text-green-700 rounded-lg">
                {success}
              </p>
            )}

            {/* Personal Info Form */}
            <form
              onSubmit={handleUpdateProfile}
              className="flex flex-col gap-6 w-full"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>
              <div className="flex flex-col gap-1 w-full max-w-md">
                <label className="text-base font-medium text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-md">
                <label className="text-base font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-md">
                <label className="text-base font-medium text-gray-700">
                  Role
                </label>
                <div className="w-full p-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg">
                  {profile.role}
                </div>
              </div>
              <div className="flex justify-end w-full">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <div className="w-full border-t border-gray-200" />

            {/* Password Change Section */}
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-medium text-gray-900">
                Change Password
              </h3>
              <button
                onClick={togglePasswordEdit}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-700"
              >
                {editPasswordMode ? "Cancel" : "Change Password"}
              </button>
            </div>

            {editPasswordMode && (
              <form
                onSubmit={handleChangePassword}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-1 w-full max-w-md">
                  <label className="text-base font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full max-w-md">
                  <label className="text-base font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full max-w-md">
                  <label className="text-base font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end w-full">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
