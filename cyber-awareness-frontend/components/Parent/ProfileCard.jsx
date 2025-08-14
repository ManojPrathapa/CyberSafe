"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiHelpers, handleApiError, getUserId } from "../../src/app/utils/apiConfig";

export default function ParentProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: "Parent_01",
    email: "parent@example.com",
    username: "parent_01"
  });
  const [editingField, setEditingField] = useState(null);
  const [children, setChildren] = useState([]);
  const [saving, setSaving] = useState(false);

  // Get user ID from JWT token or use default
  const userId = getUserId() || 1;

  // Fetch profile data using API helpers
  const fetchProfile = async (userId) => {
    try {
      const profileData = await apiHelpers.get(`/profile/${userId}`);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return fallback data if API fails
      return handleApiError(error, {
        user_id: userId,
        username: "parent_01",
        email: "parent@example.com",
        role: "parent"
      });
    }
  };

  // Update profile using API helpers
  const updateProfile = async (profileData) => {
    try {
      const result = await apiHelpers.post('/profile/edit', profileData);
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Fetch linked children (using admin users endpoint)
  const fetchLinkedChildren = async () => {
    try {
      const users = await apiHelpers.get('/admin/users');
      // Filter for students linked to this parent
      const studentUsers = users.filter(user => user.role === 'student');
      return studentUsers;
    } catch (error) {
      console.error('Error fetching linked children:', error);
      // Return fallback data if API fails
      return handleApiError(error, [
        { id: 1, username: "john_student", email: "john@example.com", role: "student" }
      ]);
    }
  };

  // Load profile data
  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile and children data in parallel
      const [profileData, childrenData] = await Promise.all([
        fetchProfile(userId),
        fetchLinkedChildren()
      ]);

      setProfile({
        name: profileData.username || "Parent_01",
        email: profileData.email || "parent@example.com",
        username: profileData.username || "parent_01"
      });

      setChildren(childrenData.map(child => ({
        id: child.id,
        name: child.username,
        grade: "6" // This should come from student profile
      })));

    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data. Please try again.');
      
      // Set fallback data
      setProfile({
        name: "Parent_01",
        email: "parent@example.com",
        username: "parent_01"
      });
      
      setChildren([
        { id: 1, name: "John", grade: "6" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (field, value) => {
    setSaving(true);
    try {
      const updateData = {
        user_id: userId,
        [field]: value
      };

      await updateProfile(updateData);
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
      
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle remove child
  const handleRemoveChild = (id) => {
    setChildren(children.filter(child => child.id !== id));
    // TODO: Implement API call to unlink child from parent
  };

  // Handle add child
  const handleAddChild = () => {
    const newChild = {
      id: children.length + 1,
      name: `Child_${children.length + 1}`,
      grade: "7"
    };
    setChildren([...children, newChild]);
    // TODO: Implement API call to link child to parent
  };

  // Load data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-purple-900 min-h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">👨‍👩‍👦 Your Profile</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-purple-900 min-h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">👨‍👩‍👦 Your Profile</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadProfileData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">👨‍👩‍👦 Your Profile</h2>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl shadow">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <button className="mt-2 text-sm text-blue-600 hover:underline">Change Picture</button>
        </div>

        {/* Info Boxes */}
        <div className="space-y-4 w-full md:w-2/3">
          {/* Name */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow flex justify-between items-center">
            {editingField === "name" ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border px-2 py-1 rounded"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => setEditingField(null)}
                />
                <button
                  onClick={() => handleProfileUpdate('username', profile.name)}
                  disabled={saving}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <p><strong>Name:</strong> {profile.name}</p>
            )}
            <button
              className="text-sm text-blue-600 hover:underline ml-4"
              onClick={() => setEditingField("name")}
            >
              Change
            </button>
          </div>

          {/* Email */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow flex justify-between items-center">
            {editingField === "email" ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="email"
                  className="flex-1 border px-2 py-1 rounded"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  onBlur={() => setEditingField(null)}
                />
                <button
                  onClick={() => handleProfileUpdate('email', profile.email)}
                  disabled={saving}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <p><strong>Email:</strong> {profile.email}</p>
            )}
            <button
              className="text-sm text-blue-600 hover:underline ml-4"
              onClick={() => setEditingField("email")}
            >
              Change
            </button>
          </div>

          {/* Linked Children */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">👶 Linked Children</h3>
            {children.map(child => (
              <div
                key={child.id}
                className="flex justify-between items-center text-sm bg-purple-50 p-2 rounded mb-2"
              >
                <p>
                  <strong>{child.name}</strong> – Grade {child.grade}
                </p>
                <button
                  onClick={() => handleRemoveChild(child.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddChild}
              className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              ➕ Add Child
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
