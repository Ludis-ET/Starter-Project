"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Camera, Lock, Save, Eye, EyeOff } from "lucide-react";
import { profileApi, getTokenFromSession, Profile, UpdateProfileData, ChangePasswordData } from "@/lib/api-client";
import LandingFooter from "../components/Footer/Landingfooter";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    profile_picture_url: "",
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session) return;
      
      try {
        const token = getTokenFromSession(session);
        if (!token) throw new Error("No access token");
        
        const response = await profileApi.getProfile(token);
        setProfile(response.data);
        setProfileForm({
          full_name: response.data.full_name,
          profile_picture_url: response.data.profile_picture_url || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    fetchProfile();
  }, [session, status, router]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;

    setUpdating(true);
    setMessage(null);

    try {
      const token = getTokenFromSession(session);
      if (!token) throw new Error("No access token");

      const updateData: UpdateProfileData = {
        full_name: profileForm.full_name,
      };

      if (profileForm.profile_picture_url) {
        updateData.profile_picture_url = profileForm.profile_picture_url;
      }

      const response = await profileApi.updateProfile(updateData, token);
      setProfile(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return;
    }

    setChangingPassword(true);
    setMessage(null);

    try {
      const token = getTokenFromSession(session);
      if (!token) throw new Error("No access token");

      const changeData: ChangePasswordData = {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      };

      await profileApi.changePassword(changeData, token);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profile.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-12 h-12 text-indigo-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-lg">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="pl-10 bg-gray-100"
                    />
                  </div>
                </div>

                {/* Role Badge */}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div>
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                  </div>
                </div>

                {/* Profile Picture URL */}
                <div className="space-y-2">
                  <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
                  <Input
                    id="profile_picture_url"
                    type="url"
                    value={profileForm.profile_picture_url}
                    onChange={(e) => setProfileForm({ ...profileForm, profile_picture_url: e.target.value })}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>

                <Button type="submit" disabled={updating} className="w-full">
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Password must be at least 8 characters long</p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                <Button type="submit" disabled={changingPassword} className="w-full" variant="default">
                  {changingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
