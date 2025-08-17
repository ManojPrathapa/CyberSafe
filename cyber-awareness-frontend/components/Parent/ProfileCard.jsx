"use client";

import { useState, useEffect, useRef } from "react";
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
  const [editingValue, setEditingValue] = useState("");
  const [children, setChildren] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Get user ID from JWT token or use default
  const userId = getUserId() || 1;

  // Fetch profile data using API helpers
  const fetchProfile = async (userId) => {
    try {
      const profileData = await apiHelpers.get(`/api/profile/${userId}`);
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

  // Fetch linked children using the real endpoint
  const fetchLinkedChildren = async () => {
    try {
      const children = await apiHelpers.get(`/api/parents/children/${userId}`);
      return children || [];
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
        email: child.email,
        grade: child.age ? `Grade ${child.age}` : "Grade N/A"
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
    if (!value || value.trim() === "") {
      setMessage({ type: 'error', text: `${field} cannot be empty.` });
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        user_id: userId,
        [field]: value.trim()
      };

      await updateProfile(updateData);
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        [field === 'username' ? 'name' : field]: value.trim(),
        username: field === 'username' ? value.trim() : prev.username
      }));
      
      setEditingField(null);
      setEditingValue("");
      setMessage({ type: 'success', text: `${field} updated successfully!` });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || `Failed to update ${field}. Please try again.` 
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit field start
  const handleEditStart = (field) => {
    setEditingField(field);
    setEditingValue(profile[field === 'username' ? 'name' : field]);
    setMessage(null);
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingField(null);
    setEditingValue("");
    setMessage(null);
  };

  // Handle picture change
  const handlePictureChange = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For now, just show a message since we don't have backend support for file uploads
      setMessage({ 
        type: 'info', 
        text: 'Picture upload functionality will be implemented soon. Selected file: ' + file.name 
      });
      
      // Clear the file input
      event.target.value = '';
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
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

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : message.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl shadow">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handlePictureChange}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Change Picture
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
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
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleProfileUpdate('username', editingValue);
                    } else if (e.key === 'Escape') {
                      handleEditCancel();
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleProfileUpdate('username', editingValue)}
                  disabled={saving}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p><strong>Name:</strong> {profile.name}</p>
            )}
            {editingField !== "name" && (
              <button
                className="text-sm text-blue-600 hover:underline ml-4"
                onClick={() => handleEditStart("name")}
              >
                Change
              </button>
            )}
          </div>

          {/* Email */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow flex justify-between items-center">
            {editingField === "email" ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="email"
                  className="flex-1 border px-2 py-1 rounded"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleProfileUpdate('email', editingValue);
                    } else if (e.key === 'Escape') {
                      handleEditCancel();
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleProfileUpdate('email', editingValue)}
                  disabled={saving}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p><strong>Email:</strong> {profile.email}</p>
            )}
            {editingField !== "email" && (
              <button
                className="text-sm text-blue-600 hover:underline ml-4"
                onClick={() => handleEditStart("email")}
              >
                Change
              </button>
            )}
          </div>

          {/* Linked Children - Read Only */}
          <div className="bg-white border border-purple-300 rounded p-4 shadow">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">👶 Linked Children</h3>
            {children.length === 0 ? (
              <p className="text-gray-500 text-sm">No children linked yet. Go to Settings to add children.</p>
            ) : (
              children.map(child => (
                <div
                  key={child.id}
                  className="text-sm bg-purple-50 p-3 rounded mb-2"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    {child.email && <p className="text-gray-600 text-xs">{child.email}</p>}
                    <p className="text-gray-600 text-xs">{child.grade}</p>
                  </div>
                </div>
              ))
            )}
            <p className="text-xs text-gray-500 mt-2">
              💡 Go to <strong>Settings → Manage Linked Children</strong> to add or remove children
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
