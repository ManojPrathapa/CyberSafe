"use client";

import { useState, useEffect } from "react";
import { Pencil, Save, UploadCloud, User } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/api";
import { getToken, getUser, saveAuth } from "@/src/app/utils/auth";

export default function ProfileCard() {
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState(null);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const user = getUser();
        if (!token || !user?.id) {
          throw new Error("User not logged in");
        }

        const res = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        setProfile({
          username: data.username || "",
          email: data.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save profile changes to backend
  const handleSave = async () => {
    try {
      const token = getToken();
      const user = getUser();
      if (!token || !user?.id) {
        throw new Error("User not logged in");
      }

      const res = await fetch(`${API_BASE_URL}/profile/edit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          username: profile.username,
          email: profile.email,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Update local storage so rest of app sees changes
      saveAuth(token, { ...user, username: profile.username, email: profile.email });

      setEditable(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-gray-800">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
          <img src="/default-avatar.png" alt="Default Avatar" className="rounded-full" />
          <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
            <UploadCloud size={18} className="text-purple-600" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            <User /> Student Profile
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-inner space-y-4">
        <div>
          <label className="block font-semibold text-purple-700">Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-purple-700">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!editable}
            className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setEditable(!editable)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Pencil size={16} /> {editable ? "Cancel" : "Edit"}
          </button>
          {editable && (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}