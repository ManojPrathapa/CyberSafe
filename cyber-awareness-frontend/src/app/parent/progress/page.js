"use client";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

export default function ParentProgress() {
  // Chart Data
  const modules = [
    { name: "Completed", value: 4 },
    { name: "Remaining", value: 2 }
  ];

  const badges = [
    { name: "Beginner", count: 1 },
    { name: "Safety Star", count: 1 }
  ];

  const scoreData = [
    { name: "Module 1", score: 85 },
    { name: "Module 2", score: 90 },
    { name: "Module 3", score: 95 },
    { name: "Module 4", score: 86 }
  ];

  const timeData = [
    { day: "Mon", mins: 30 },
    { day: "Tue", mins: 35 },
    { day: "Wed", mins: 40 },
    { day: "Thu", mins: 32 },
    { day: "Fri", mins: 38 }
  ];

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">📈 Child’s Progress Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modules Completed */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📘 Modules Completed</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={modules}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {modules.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm mt-2">4 out of 6 modules completed</p>
        </div>

        {/* Badges Earned */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">🏅 Badges Earned</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={badges}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm mt-2">Earned: Beginner, Safety Star</p>
        </div>

        {/* Average Score */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">🧠 Average Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scoreData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm mt-2">Avg Score: 89%</p>
        </div>

        {/* Time Spent Learning */}
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">⏰ Time Spent Learning</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mins" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm mt-2">~35 min/day average</p>
        </div>
      </div>
    </div>
  );
}
