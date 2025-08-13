"use client";

import Header from "@/components/Support/SupportHeader";
import { useState } from "react";
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, Tooltip, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const studentLineData = [
  { name: "Week 1", students: 200 },
  { name: "Week 2", students: 400 },
  { name: "Week 3", students: 700 },
  { name: "Week 4", students: 500 },
];

const rolePieData = [
  { name: "18-24", value: 18 },
  { name: "25-34", value: 32 },
  { name: "35-44", value: 19 },
  { name: "45-54", value: 14 },
  { name: "55-64", value: 10 },
];

const videoBarData = [
  { name: "Week 1", videos: 20 },
  { name: "Week 2", videos: 35 },
  { name: "Week 3", videos: 40 },
  { name: "Week 4", videos: 28 },
];

const quizBarData = [
  { name: "Red", attempted: 30 },
  { name: "Blue", attempted: 40 },
  { name: "Green", attempted: 50 },
  { name: "Yellow", attempted: 60 },
  { name: "Black", attempted: 35 },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SupportDashboard() {
  const [reportMonth, setReportMonth] = useState("January");
  const [summaryMonth, setSummaryMonth] = useState("January");

  return (
    <>
      <Header page="dashboard" />
      <div className="p-6 bg-[#f3f2e8] min-h-screen">
        {/* Stats */}
        <h1 className="text-2xl font-bold mb-6 text-center text-black">SUPPORT DASHBOARD</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">COMPLAINTS IN THIS MONTH: <span className="text-blue-700">50</span></p>
            <p className="font-bold text-black">COMPLAINTS RSOLVED THIS MONTH: <span className="text-blue-700">40</span></p>
            <p className="font-bold text-black">COMPLAINTS PENDING: <span className="text-blue-700">6</span></p>
            <p className="font-bold text-black">COMPLAINTS REJECTED: <span className="text-blue-700">4</span></p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">ALERTS SENT THIS MONTH: <span className="text-blue-700">20</span></p>
          </div>
          {/*
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="font-bold text-black">TOTAL MENTORS: <span className="text-blue-700">10</span></p>
            <p className="font-bold text-black">NEW MENTORS THIS MONTH: <span className="text-blue-700">2</span></p>
          </div>
          */}
        </div>
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Line Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">COMPLAINTS IN EVERY MONTH</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={studentLineData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">CUSTOMER FEEDBACK</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={rolePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {rolePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Download Report 
          <div className="bg-pink-100 border p-4 rounded shadow flex flex-col justify-between">
            <h3 className="font-bold text-center mb-2 text-black">DOWNLOAD USER MONTHLY REPORT</h3>
            <label className="text-sm text-center text-black">SELECT MONTH: 
            <select
              className="border rounded px-2 py-1 mb-3 border-blue-500 text-black"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            </label>
            <button className="bg-black text-white py-2 rounded hover:bg-gray-800">
              ⬇ DOWNLOAD
            </button>
          </div>
           */}
        </div>
        
        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bar Chart - Videos */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">FEEDBACKS IN EVERY MONTH</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={videoBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="videos" fill="#ff7f7f" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Quizzes */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-center font-semibold mb-2 text-black">TOTAL QUIZZED ATTEMPTED</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quizBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attempted" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Download Summary 
          <div className="bg-pink-100 border p-4 rounded shadow flex flex-col justify-between">
            <h3 className="font-bold text-center mb-2 text-black">DOWNLOAD MONTHLY CONTENT SUMMARY</h3>
            <label className="text-sm text-center text-black">SELECT MONTH:
            <select
              className="border rounded px-2 py-1 mb-3 border-blue-500 text-black"
              value={summaryMonth}
              onChange={(e) => setSummaryMonth(e.target.value)}
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            </label>
            <button className="bg-black text-white py-2 rounded hover:bg-gray-800">
              ⬇ DOWNLOAD
            </button>
          </div>
          */}
        </div>
      </div>
    </>
  );
}
