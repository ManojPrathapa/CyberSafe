"use client";

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function ParentDashboard() {
  const quizStats = [
    { module: "1", score: 80 },
    { module: "2", score: 85 },
    { module: "3", score: 90 },
    { module: "4", score: 89 }
  ];

  const tipsRead = [
    { topic: "Passwords", count: 2 },
    { topic: "Monitoring", count: 3 },
    { topic: "Controls", count: 1 },
    { topic: "Social Media", count: 4 }
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">📊 Parent Dashboard</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">👨‍👩‍👧‍👦 Linked Children</h4>
          <p className="text-sm text-gray-700">1 child account linked</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🧠 Average Quiz Score</h4>
          <p className="text-sm text-gray-700">86%</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📅 Last Active</h4>
          <p className="text-sm text-gray-700">2 hours ago</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">💡 Tips Read</h4>
          <p className="text-sm text-gray-700">10 total</p>
        </div>
      </div>

      {/* Quiz Performance Line Chart */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition mb-10">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📈 Child’s Quiz Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={quizStats}>
            <XAxis dataKey="module" label={{ value: "Module", position: "insideBottom", dy: 10 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tips Read Breakdown */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📘 Tips Read by Topic</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={tipsRead}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
