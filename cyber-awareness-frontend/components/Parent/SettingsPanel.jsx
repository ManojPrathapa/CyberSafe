"use client";

import Link from "next/link";

export default function SettingsPanel() {
  const settings = [
    { icon: "🔒", label: "Change Password" },
    { icon: "📩", label: "Notification Preferences" },
    { icon: "👨‍👩‍👧", label: "Manage Linked Children" },
    { icon: "🌙", label: "Enable Dark Mode" }
  ];

  return (
    <div className="p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">⚙️ Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {settings.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-md hover:bg-purple-50 transition transform hover:scale-[1.01]"
          >
            <h4 className="text-lg font-semibold mb-2">
              {item.icon} {item.label}
            </h4>
            <p className="text-sm text-gray-600">Manage {item.label.toLowerCase()} settings here.</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/parent/complaint">
          <button className="bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 transition text-sm">
            🚨 Raise a Complaint
          </button>
        </Link>
      </div>
    </div>
  );
}
