"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ChildActivity() {
  // Sample data
  const quizScores = [
    { module: "1", score: 85 },
    { module: "2", score: 86 },
    { module: "3", score: 90 },
    { module: "4", score: 84 }
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Child's Recent Activity</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🕓 Last Active</h4>
          <p className="text-gray-700 text-sm">1 day ago</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📅 Last Login</h4>
          <p className="text-gray-700 text-sm">June 15, 2025</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">⏰ Time Spent (Avg)</h4>
          <p className="text-gray-700 text-sm">40 mins/day</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📘 Last Module Watched</h4>
          <p className="text-gray-700 text-sm">Module 2.2 – Social Media Safety</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🏅 Recent Badge</h4>
          <p className="text-gray-700 text-sm">Safe Clicker</p>
        </div>
      </div>

      {/* Quiz Chart */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
        <h4 className="text-lg font-semibold mb-4 text-purple-700">📊 Quiz Scores</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={quizScores}>
            <XAxis dataKey="module" label={{ value: "Module", position: "insideBottom", dy: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">Scores out of 10</p>
      </div>
    </div>
  );
}
