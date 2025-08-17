"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken, getUser } from "@/src/app/utils/auth";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

export default function StudentDashboard() {
  const [scoreData, setScoreData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [doubtsData, setDoubtsData] = useState([]);
  const [moduleProgress, setModuleProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = getToken();
        const user = getUser();
        if (!user?.id) {
          console.error("No logged-in user found");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/dashboard/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const data = await res.json();

        setScoreData(data.scores || []);
        setTimeData(data.timeSpent || []);
        setDoubtsData(data.doubts || []);
        setModuleProgress(data.progress || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-purple-900">Loading dashboard...</div>;
  }

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
          <p className="mt-2 text-sm">
            Average Score: <strong>
              {scoreData.length
                ? `${(
                    scoreData.reduce((sum, s) => sum + s.score, 0) / scoreData.length
                  ).toFixed(1)}%`
                : "N/A"}
            </strong>
          </p>
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
          {doubtsData.length >= 2 && (
            <p className="mt-2 text-sm">
              {doubtsData[0].value} Doubts Asked | {doubtsData[1].value} Resolved
            </p>
          )}
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
          {moduleProgress.length >= 2 && (
            <p className="mt-2 text-sm">
              {moduleProgress[0].modules} Modules Completed | {moduleProgress[1].modules} Remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}