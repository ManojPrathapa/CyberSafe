"use client";

import {
  LineChart, Line,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const scoreData = [
  { name: "Module 1", score: 70 },
  { name: "Module 2", score: 85 },
  { name: "Module 3", score: 90 },
  { name: "Module 4", score: 80 }
];

const timeData = [
  { name: "Mon", mins: 20 },
  { name: "Tue", mins: 35 },
  { name: "Wed", mins: 40 },
  { name: "Thu", mins: 30 },
  { name: "Fri", mins: 50 }
];

const doubtsData = [
  { name: "Asked", value: 3 },
  { name: "Resolved", value: 2 }
];

const moduleProgress = [
  { name: "Completed", modules: 4 },
  { name: "Remaining", modules: 2 }
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

export default function StudentDashboard() {
  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Scores */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">🧠 Quiz Scores</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scoreData}>
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              <XAxis dataKey="name" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Average Score: <strong>82%</strong></p>
        </div>

        {/* Time Spent */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">⏰ Time Spent</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mins" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">Avg Time per Day: <strong>40 min</strong></p>
        </div>

        {/* Doubts */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">❓ Doubts Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={doubtsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {doubtsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">3 Doubts Asked | 2 Resolved</p>
        </div>

        {/* Modules Completed */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📘 Modules Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={moduleProgress}
                dataKey="modules"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#ffc658"
                label
              >
                {moduleProgress.map((_, index) => (
                  <Cell key={`cell-mod-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">4 Modules Completed | 2 Remaining</p>
        </div>
      </div>
    </div>
  );
}
