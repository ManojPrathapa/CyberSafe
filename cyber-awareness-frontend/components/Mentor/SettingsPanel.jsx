"use client";

import { useState } from "react";
import { Bell, Lock, EyeOff, Send, Shield } from "lucide-react";

export default function SettingsPanel() {
  const [complaint, setComplaint] = useState("");
  const [showForm, setShowForm] = useState(false);

  const toggleComplaintForm = () => setShowForm(!showForm);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-gray-800">
      <h3 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        <Shield size={28} /> Settings
      </h3>

      <div className="space-y-4 text-sm">
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-3">
          <Lock className="text-indigo-600" />
          <span>Update Password</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-3">
          <Bell className="text-indigo-600" />
          <span>Notification Preferences</span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-3">
          <EyeOff className="text-indigo-600" />
          <span>Account Privacy Settings</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={toggleComplaintForm}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <Send size={18} /> {showForm ? "Cancel Complaint" : "Raise Complaint"}
        </button>

        {showForm && (
          <div className="mt-4">
            <textarea
              placeholder="Describe your issue or complaint..."
              rows={4}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            ></textarea>
            <button
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
            >
              Submit Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
