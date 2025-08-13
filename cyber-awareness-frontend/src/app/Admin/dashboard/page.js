"use client";

import Header from "@/components/Admin/adminHeader";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/src/app/utils/api";
import { getToken } from "@/src/app/utils/auth";
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, Tooltip, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const intFormatter = (val) => Math.round(val);

export default function AdminDashboard() {
  const [reportMonth, setReportMonth] = useState(months[0]);
  const [summaryMonth, setSummaryMonth] = useState(months[0]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) return console.error("No token");

      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load users");
        setUsers(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roleCounts = users.reduce((a, u) => {
    a[u.role] = (a[u.role]||0)+1;
    return a;
  }, {});
  const rolePieData = Object.entries(roleCounts).map(([role, v]) => ({ name: role, value: v }));

  const totalStudents = roleCounts.student || 0;
  const totalMentors = roleCounts.mentor || 0;
  const totalParents = roleCounts.parent || 0;

  // Chart sample: students over weeks
  const studentLineData = [
    { name: "Week 1", students: Math.floor(totalStudents * 0.25) },
    { name: "Week 2", students: Math.floor(totalStudents * 0.5) },
    { name: "Week 3", students: Math.floor(totalStudents * 0.75) },
    { name: "Week 4", students: totalStudents },
  ];

  // Stub data for videos/quizzes if no backend yet
  const videoBarData = [{ name: "Videos", videos: totalStudents }];  
  const quizBarData = [{ name: "Quizzes", attempted: totalStudents }];

  const downloadUserReport = () => {
    const token = getToken();
    if (!token) return;
    window.open(`${API_BASE_URL}/api/admin/reports/download/users?month=${reportMonth}`, "_blank");
  };
  const downloadSummary = () => {
    const token = getToken();
    if (!token) return;
    window.open(`${API_BASE_URL}/api/admin/reports/download/summary?month=${summaryMonth}`, "_blank");
  };

  if (loading) return <p className="text-gray-600 p-6">Loading...</p>;

  return (
    <>
      <Header page="dashboard"/>
      <div className="p-6 bg-[#f3f2e8] min-h-screen">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">TOTAL STUDENTS: <span className="text-blue-700">{totalStudents}</span></p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">TOTAL MENTORS: <span className="text-blue-700">{totalMentors}</span></p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">TOTAL PARENTS: <span className="text-blue-700">{totalParents}</span></p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Students Line */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">STUDENTS IN APP</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={studentLineData}>
                <XAxis dataKey="name"/>
                <YAxis tickFormatter={intFormatter}/>
                <Tooltip formatter={intFormatter}/>
                <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Roles Pie */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">ROLE DISTRIBUTION</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={rolePieData} dataKey="value" nameKey="name" label outerRadius={70}>
                  {rolePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={intFormatter}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Download User Report */}
          <div className="bg-pink-100 border p-4 rounded shadow flex flex-col justify-between">
            <h3 className="font-bold text-center mb-2 text-black">DOWNLOAD USER REPORT</h3>
            <label className="text-sm text-center text-black">
              SELECT MONTH:
              <select
                className="border rounded px-2 py-1 mb-3 border-blue-500 text-black"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <button onClick={downloadUserReport} className="bg-black text-white py-2 rounded hover:bg-gray-800">⬇ DOWNLOAD</button>
          </div>
        </div>

        {/* Videos/Quizzes & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Videos */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">VIDEOS WATCHED</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={videoBarData}>
                <XAxis dataKey="name"/>
                <YAxis tickFormatter={intFormatter}/>
                <Tooltip formatter={intFormatter}/>
                <Bar dataKey="videos" fill="#ff7f7f"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quizzes */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">QUIZZES ATTEMPTED</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quizBarData}>
                <XAxis dataKey="name"/>
                <YAxis tickFormatter={intFormatter}/>
                <Tooltip formatter={intFormatter}/>
                <Bar dataKey="attempted" fill="#8884d8"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Download Summary */}
          <div className="bg-pink-100 border p-4 rounded shadow flex flex-col justify-between">
            <h3 className="font-bold text-center mb-2 text-black">DOWNLOAD CONTENT SUMMARY</h3>
            <label className="text-sm text-center text-black">
              SELECT MONTH:
              <select
                className="border rounded px-2 py-1 mb-3 border-blue-500 text-black"
                value={summaryMonth}
                onChange={(e) => setSummaryMonth(e.target.value)}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <button onClick={downloadSummary} className="bg-black text-white py-2 rounded hover:bg-gray-800">⬇ DOWNLOAD</button>
          </div>
        </div>
      </div>
    </>
  );
}
