"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { profileApi, Profile, ChangePasswordData } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    profile_picture: null as File | null
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (session?.accessToken) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile(session!.accessToken);
      setProfile(response.data);
      setProfileForm({
        full_name: response.data.full_name,
        email: response.data.email,
        profile_picture: null
      });
      setPreviewImage(response.data.profile_picture_url || '');
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setUpdating(true);
    setError('');
    setMessage('');
    try {
      // const formData = new FormData();
      // formData.append('full_name', profileForm.full_name);
      // formData.append('email', profileForm.email);
      // if (profileForm.profile_picture) {
      //   formData.append('profile_picture', profileForm.profile_picture);
      // }
      await profileApi.updateProfile({full_name: profileForm.full_name, email: profileForm.email}, session.accessToken);
      setMessage('Profile updated successfully');
      await fetchProfile();
      // setProfileForm(prev => ({ ...prev, profile_picture: null }));
    } catch {
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    setUpdating(true);
    setError('');
    setMessage('');
    try {
      const changeData: ChangePasswordData = {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      };
      await profileApi.changePassword(changeData, session.accessToken);
      setMessage('Password changed successfully');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch {
      setError('Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileForm(prev => ({ ...prev, profile_picture: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-0 overflow-hidden">
        <div className="relative h-40 bg-gray-200">
          <img src="/banner.jpg" alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute left-6 bottom-0 translate-y-1/2">
            <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
              <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full p-1 cursor-pointer shadow">
                <Camera className="w-4 h-4" />
              </label>
              <input id="profile-picture" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>
        </div>
        <div className="pt-16 px-6">
          <h1 className="text-xl font-bold">{profile?.full_name}</h1>
          <p className="text-gray-500">{profile?.email}</p>
        </div>
        <div className="p-6 space-y-6">
          {message && <Alert className="bg-green-50 text-green-800 border-green-200">{message}</Alert>}
          {error && <Alert className="bg-red-50 text-red-800 border-red-200">{error}</Alert>}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <Input value={profileForm.full_name} onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Full Name" />
            <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email Address" />
            <Input value={profile?.role || ''} disabled className="bg-gray-50" />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input type="password" value={passwordForm.old_password} onChange={(e) => setPasswordForm(prev => ({ ...prev, old_password: e.target.value }))} placeholder="Current Password" />
            <Input type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))} placeholder="New Password" />
            <Input type="password" value={passwordForm.confirm_password} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))} placeholder="Confirm New Password" />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={updating}>
              {updating ? 'Saving...' : 'Change Password'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
