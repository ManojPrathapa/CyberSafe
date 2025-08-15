"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/api";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Area,
  YAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

export default function DashboardStats() {
  const [videos, getVideos] = useState([]);
  const [doubts, getDoubts] = useState([]);
  const [videos_2, getVideos_2] = useState([]);
  const [videos_3, getVideos_3] = useState([]);

  const Video_Status = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/videostatus/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      const video_data = [
        { name: "Approved", value: data["Approved"] },
        { name: "Not Approved", value: data["Not Approved"] },
      ];

      getVideos(video_data);
      console.log("VIDEO DATA");
      //console.log(data);
      console.log(video_data);
      console.log(videos);
      //console.log(videos);
    } catch (error) {
      console.error("Failed to  fetch video status", error);
    } finally {
      console.log("In Finally");
    }
  };

  const Video_Status_2 = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/videostatus_2/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      const video_data_2 = [
        { name: "Jan", uploads: data["Jan"] },
        { name: "Feb", uploads: data["Feb"] },
        { name: "Mar", uploads: data["Mar"] },
        { name: "Apr", uploads: data["Apr"] },
        { name: "May", uploads: data["May"] },
        { name: "Jun", uploads: data["Jun"] },
        { name: "Jul", uploads: data["Jul"] },
        { name: "Aug", uploads: data["Aug"] },
        { name: "Sep", uploads: data["Sep"] },
        { name: "Oct", uploads: data["Oct"] },
        { name: "Nov", uploads: data["Nov"] },
        { name: "Dec", uploads: data["Dec"] },
      ];

      getVideos_2(video_data_2);
      console.log("VIDEO DATA");
      //console.log(data);
      console.log(video_data_2);
      //console.log(videos);
    } catch (error) {
      console.error("Failed to  fetch video status", error);
    } finally {
      console.log("In Finally");
    }
  };
  const Video_Status_3 = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/videostatus_3/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();

      getVideos_3(data);
      console.log("VIDEO DATA_3");
      console.log(data);
      //console.log(videos);
    } catch (error) {
      console.error("Failed to  fetch video status", error);
    } finally {
      console.log("In Finally");
    }
  };

  const Doubt_Status = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/doubtstatus/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      const doubt_data = [
        { name: "Answered", modules: data["Answered"] },
        { name: "Not Answered", modules: data["Not Answered"] },
      ];
      getDoubts(doubt_data);
      console.log("DOUBT DATA");
      console.log(data);
    } catch (error) {
      console.error("Failed to  fetch video status", error);
    } finally {
      console.log("In Finally");
    }
  };
  useEffect(() => {
    Video_Status();
    Doubt_Status();
    Video_Status_2();
    Video_Status_3();
    console.log("Videos and Doubts are fetched");
    //console.log(typeof modules);
    console.log(videos);
  }, []);

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">
        📊 Mentor Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Uploads */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📁 Content Uploaded</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={videos_2}>
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <XAxis dataKey="name" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Views and Likes */}
        <div style={{ width: "100%" }}>
          <h4>Content Views</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={500}
              height={200}
              data={videos_3}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p>Maybe some other content</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={500}
              height={200}
              data={videos_3}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content Stats */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📝 Content Stats</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={videos}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {videos.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">
            {videos.length > 0
              ? `Approved: ${videos[0].value} | Not Approved: ${videos[1].value}`
              : "Loading..."}
          </p>
        </div>

        {/* Doubt Replied */}
        <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">📘 Doubts Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={doubts}
                dataKey="modules"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#ffc658"
                label
              >
                {doubts.map((_, index) => (
                  <Cell
                    key={`cell-mod-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm">
            {doubts.length > 0
              ? `Answered: ${doubts[0].modules} | Not Answered: ${doubts[1].modules}`
              : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
