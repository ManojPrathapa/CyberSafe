"use client";

import { useState } from "react";
import Image from "next/image";

export default function StudentProfile() {
  const [name, setName] = useState("Student Name");
  const [email, setEmail] = useState("student@example.com");
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [profilePic, setProfilePic] = useState("/default-avatar.png"); // add this image to /public folder

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Your Profile</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side: Profile Details */}
        <div className="flex-1 space-y-6">
          {/* Name Box */}
          <div className="bg-white border border-purple-300 p-4 rounded shadow">
            <p className="font-semibold text-sm text-gray-500 mb-1">Name:</p>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  className="text-sm text-white bg-green-600 px-2 py-1 rounded"
                  onClick={() => setEditingName(false)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p>{name}</p>
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => setEditingName(true)}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Email Box */}
          <div className="bg-white border border-purple-300 p-4 rounded shadow">
            <p className="font-semibold text-sm text-gray-500 mb-1">Email ID:</p>
            {editingEmail ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  className="text-sm text-white bg-green-600 px-2 py-1 rounded"
                  onClick={() => setEditingEmail(false)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p>{email}</p>
                <button
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => setEditingEmail(true)}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-100 p-4 rounded shadow">
              <p className="font-semibold text-sm text-gray-600">Modules Completed</p>
              <p className="text-lg font-bold mt-1">Module 1</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow">
              <p className="font-semibold text-sm text-gray-600">Badges Earned</p>
              <p className="text-lg font-bold mt-1">Beginner, Safety Champ</p>
            </div>
            <div className="bg-green-100 p-4 rounded shadow">
              <p className="font-semibold text-sm text-gray-600">Start Date</p>
              <p className="text-lg font-bold mt-1">May 10, 2025</p>
            </div>
            <div className="bg-pink-100 p-4 rounded shadow">
              <p className="font-semibold text-sm text-gray-600">Cyber Ready %</p>
              <p className="text-lg font-bold mt-1">68%</p>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Picture */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-start">
          <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md mb-2">
            <Image
              src={profilePic}
              alt="Profile Picture"
              fill
              className="object-cover"
            />
          </div>
          <label className="text-sm font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm mt-1"
          />
        </div>
      </div>
    </div>
  );
}
