"use client";

import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { apiHelpers, handleApiError, getUserId } from "../../src/app/utils/apiConfig";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStats, setQuizStats] = useState([]);
  const [tipsRead, setTipsRead] = useState([]);
  const [childActivity, setChildActivity] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    linkedChildren: 0,
    averageScore: 0,
    lastActive: '',
    tipsRead: 0
  });

  // Get user IDs from JWT token or use defaults
  const parentId = getUserId() || 1;
  const studentId = 1; // This should come from parent's linked children - TODO: implement parent-child relationship

  // Fetch quiz performance data
  const fetchQuizStats = async (studentId) => {
    try {
      const attempts = await apiHelpers.get(`/student/${studentId}/attempts`);
      return attempts;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      // Return mock data if API fails
      return handleApiError(error, [
        { module: "1", score: 80 },
        { module: "2", score: 85 },
        { module: "3", score: 90 },
        { module: "4", score: 89 }
      ]);
    }
  };

  // Fetch tips viewed by parent
  const fetchViewedTips = async (parentId) => {
    try {
      const viewedTips = await apiHelpers.get(`/tips/viewed/${parentId}`);
      return viewedTips;
    } catch (error) {
      console.error('Error fetching viewed tips:', error);
      // Return mock data if API fails
      return handleApiError(error, [
        { topic: "Passwords", count: 2 },
        { topic: "Monitoring", count: 3 },
        { topic: "Controls", count: 1 },
        { topic: "Social Media", count: 4 }
      ]);
    }
  };

  // Fetch child activity data
  const fetchChildActivity = async (studentId) => {
    try {
      const activity = await apiHelpers.get(`/activity/${studentId}`);
      return activity;
    } catch (error) {
      console.error('Error fetching child activity:', error);
      // Return mock data if API fails
      return {
        last_active: "2 hours ago",
        login_count: 15,
        time_spent: "40 mins/day",
        recent_activities: []
      };
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [quizData, tipsData, activityData] = await Promise.all([
        fetchQuizStats(studentId),
        fetchViewedTips(parentId),
        fetchChildActivity(studentId)
      ]);

      setQuizStats(quizData);
      setTipsRead(tipsData);
      setChildActivity(activityData);

      // Calculate dashboard statistics
      const averageScore = quizData.length > 0 
        ? Math.round(quizData.reduce((sum, item) => sum + item.score, 0) / quizData.length)
        : 0;

      setDashboardStats({
        linkedChildren: 1, // This should come from parent-child relationship API
        averageScore,
        lastActive: activityData.last_active || "2 hours ago",
        tipsRead: tipsData.length || 10
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set fallback data
      setQuizStats([
        { module: "1", score: 80 },
        { module: "2", score: 85 },
        { module: "3", score: 90 },
        { module: "4", score: 89 }
      ]);
      
      setTipsRead([
        { topic: "Passwords", count: 2 },
        { topic: "Monitoring", count: 3 },
        { topic: "Controls", count: 1 },
        { topic: "Social Media", count: 4 }
      ]);
      
      setDashboardStats({
        linkedChildren: 1,
        averageScore: 86,
        lastActive: "2 hours ago",
        tipsRead: 10
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">📊 Parent Dashboard</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">📊 Parent Dashboard</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">📊 Parent Dashboard</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">👨‍👩‍👧‍👦 Linked Children</h4>
          <p className="text-sm text-gray-700">{dashboardStats.linkedChildren} child account linked</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🧠 Average Quiz Score</h4>
          <p className="text-sm text-gray-700">{dashboardStats.averageScore}%</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📅 Last Active</h4>
          <p className="text-sm text-gray-700">{dashboardStats.lastActive}</p>
        </div>

        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">💡 Tips Read</h4>
          <p className="text-sm text-gray-700">{dashboardStats.tipsRead} total</p>
        </div>
      </div>

      {/* Quiz Performance Line Chart */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition mb-10">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📈 Child's Quiz Performance</h3>
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
