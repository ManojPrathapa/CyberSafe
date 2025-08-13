"use client";

import {
  LineChart, Line,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const contentData = [
  { name: "Module 1", uploads: 3 },
  { name: "Module 2", uploads: 5 },
  { name: "Module 3", uploads: 4 },
  { name: "Module 4", uploads: 2 }
];

const doubtsResolvedData = [
  { name: "Mon", resolved: 5 },
  { name: "Tue", resolved: 3 },
  { name: "Wed", resolved: 6 },
  { name: "Thu", resolved: 4 },
  { name: "Fri", resolved: 7 }
];

const quizStats = [
  { name: "Created", value: 12 },
  { name: "Used", value: 9 }
];

const mentorProgress = [
  { name: "Answered", modules: 15 },
  { name: "Pending", modules: 5 }
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

export default function DashboardStats() {
  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">📊 Mentor Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Uploads */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📁 Content Uploads</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={contentData}>
              <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
              <XAxis dataKey="name" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Total Uploads: <strong>14</strong></p>
        </div>

        {/* Doubts Resolved */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">🗨️ Doubts Resolved</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={doubtsResolvedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="resolved" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Avg Doubts per Day: <strong>5</strong></p>
        </div>

        {/* Quiz Stats */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📝 Quiz Stats</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={quizStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {quizStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Created: 12 | Used: 9</p>
        </div>

        {/* Student Doubts Progress */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📘 Doubts Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mentorProgress}
                dataKey="modules"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#ffc658"
                label
              >
                {mentorProgress.map((_, index) => (
                  <Cell key={`cell-mod-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Answered: 15 | Pending: 5</p>
        </div>
      </div>
    </div>
  );
}
