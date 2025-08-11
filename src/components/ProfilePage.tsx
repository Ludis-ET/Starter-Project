"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    full_name: 'Loading...',
    email: 'Loading...',
    role: 'Loading...',
    profile_picture_url: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setProfile(data.data);
            setFormData({
              full_name: data.data.full_name,
              email: data.data.email,
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile({
            full_name: 'Error loading name',
            email: 'Error loading email',
            role: 'Error loading role',
            profile_picture_url: null,
          });
        }
      }
    };
    fetchProfile();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ full_name: formData.full_name, email: formData.email, profile_picture: null }), // Assuming no file upload for simplicity
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setEditMode(false);
        setError('');
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setError('');
      } else {
        setError('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Error changing password');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center gap-10 w-full max-w-[896px] h-auto">
        <div className="flex flex-col items-center w-full max-w-[832px]">
          <div className="w-full h-[192px] bg-gray-200 rounded-lg" style={{ backgroundImage: profile.profile_picture_url ? `url(${profile.profile_picture_url})` : 'url(.jpg)' }}></div>
          <div className="flex items-end w-full max-w-[768px] h-[128px] mt-[-64px]">
            <div className="w-[128px] h-[128px] bg-gray-200 rounded-full" style={{ backgroundImage: profile.profile_picture_url ? `url(${profile.profile_picture_url})` : 'url(.jpg)', boxShadow: '0 0 0 4px #FFFFFF' }}></div>
            <div className="flex flex-col items-start p-6 w-full max-w-[640px] h-[104px]">
              <div className="flex justify-end items-center p-6 w-full max-w-[620px] h-[80px]">
                <div className="flex flex-col w-full max-w-[620px] h-[52px]">
                  <div className="flex w-full max-w-[620px] h-[32px]">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                  </div>
                  <div className="flex w-full max-w-[620px] h-[20px]">
                    <p className="text-sm text-gray-500">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[832px] h-auto bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-start p-6 gap-6 w-full h-auto">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="flex flex-col gap-6 w-full max-w-[784px] h-auto">
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  // disabled={!editMode}
                  className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg text-sm text-black"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg text-sm text-black"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">Role</label>
                <div className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg">
                  <div className="w-full max-w-[514.66px] h-[20px] text-sm text-black">{profile.role}</div>
                </div>
              </div>
      
                <div className="flex justify-end w-full max-w-[784px]">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
            </div>
            <div className="flex justify-between w-full max-w-[784px]">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
            <div className="flex flex-col gap-6 w-full max-w-[784px] h-auto">
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg text-sm text-black"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg text-sm text-black"
                />
              </div>
              <div className="flex flex-col gap-1 w-full max-w-[514.66px] h-auto">
                <label className="text-base font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full max-w-[514.66px] h-[20px] bg-white shadow-sm rounded-lg text-sm text-black"
                />
              </div>
            </div>
            {editMode && (
              <div className="flex justify-end w-full max-w-[784px] bg-gray-100 p-3">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}