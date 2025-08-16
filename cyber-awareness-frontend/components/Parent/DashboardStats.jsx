"use client";

import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { apiHelpers, handleApiError, getUserId, isAuthenticated } from "../../src/app/utils/apiConfig";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStats, setQuizStats] = useState([]);
  const [tipsRead, setTipsRead] = useState([]);
  const [childActivity, setChildActivity] = useState(null);
  const [linkedChildren, setLinkedChildren] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    linkedChildren: 0,
    averageScore: 0,
    lastActive: '',
    tipsRead: 0
  });

  // Get parent ID from JWT token or use default
  const parentId = getUserId() || 1;

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Single API call to get all dashboard data
      const dashboardData = await apiHelpers.get(`/dashboard/parent/${parentId}`);
      
      // Set all data from the single response
      setLinkedChildren(dashboardData.linked_children || []);
      setQuizStats(dashboardData.quiz_stats || []);
      setTipsRead(dashboardData.tips_stats || []);
      setChildActivity(dashboardData.most_recent_activity || {});

      // Calculate dashboard statistics
      const averageScore = dashboardData.quiz_stats && dashboardData.quiz_stats.length > 0 
        ? Math.round(dashboardData.quiz_stats.reduce((sum, item) => sum + item.score, 0) / dashboardData.quiz_stats.length)
        : 0;

      setDashboardStats({
        linkedChildren: dashboardData.linked_children_count || 0,
        averageScore,
        lastActive: dashboardData.most_recent_activity?.last_active || "2 hours ago",
        tipsRead: dashboardData.total_viewed_tips || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set fallback data
      setLinkedChildren([]);
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
        linkedChildren: 0,
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
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log('DashboardStats: User not authenticated, showing fallback data');
      setLinkedChildren([]);
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
        linkedChildren: 0,
        averageScore: 86,
        lastActive: "2 hours ago",
        tipsRead: 10
      });
      
      setChildActivity({
        last_active: "2 hours ago",
        login_count: 15,
        time_spent: "40 mins/day",
        recent_activities: []
      });
      
      setLoading(false);
      return;
    }
    
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
          <p className="text-sm text-gray-700">
            {dashboardStats.linkedChildren === 0 
              ? "No children linked" 
              : `${dashboardStats.linkedChildren} child${dashboardStats.linkedChildren > 1 ? 'ren' : ''} linked`
            }
          </p>
          {linkedChildren.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {linkedChildren.map(child => child.username).join(', ')}
            </div>
          )}
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
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📈 Children's Quiz Performance</h3>
        {quizStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={quizStats}>
              <XAxis dataKey="module" label={{ value: "Module", position: "insideBottom", dy: 10 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
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
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No quiz data available</p>
          </div>
        )}
      </div>

      {/* Tips Read Breakdown */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📘 Tips Read by Topic</h3>
        {tipsRead.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tipsRead}>
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No tips data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
