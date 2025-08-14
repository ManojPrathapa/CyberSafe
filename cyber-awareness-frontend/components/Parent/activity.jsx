"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { apiHelpers, handleApiError } from "../../src/app/utils/apiConfig";

export default function ChildActivity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizScores, setQuizScores] = useState([]);
  const [activityData, setActivityData] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    lastActive: '',
    lastLogin: '',
    timeSpent: '',
    lastModule: '',
    recentBadge: ''
  });

  // Student ID - should come from parent's linked children
  const studentId = 1; // TODO: implement parent-child relationship

  // Fetch child activity data using API helpers
  const fetchChildActivity = async (studentId) => {
    try {
      const activity = await apiHelpers.get(`/activity/${studentId}`);
      return activity;
    } catch (error) {
      console.error('Error fetching child activity:', error);
      // Return fallback data if API fails
      return handleApiError(error, {
        last_active: "1 day ago",
        login_count: 15,
        time_spent: "40 mins/day",
        recent_activities: [],
        last_login: "June 15, 2025",
        last_module: "Module 2.2 – Social Media Safety",
        recent_badge: "Safe Clicker"
      });
    }
  };

  // Fetch quiz scores using API helpers
  const fetchQuizScores = async (studentId) => {
    try {
      const attempts = await apiHelpers.get(`/student/${studentId}/attempts`);
      return attempts;
    } catch (error) {
      console.error('Error fetching quiz scores:', error);
      // Return fallback data if API fails
      return handleApiError(error, [
        { module: "1", score: 85 },
        { module: "2", score: 86 },
        { module: "3", score: 90 },
        { module: "4", score: 84 }
      ]);
    }
  };

  // Fetch performance reports using API helpers
  const fetchReports = async (studentId) => {
    try {
      const reportsData = await apiHelpers.get(`/reports/${studentId}`);
      return reportsData;
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Return empty array if API fails
      return [];
    }
  };

  // Load all activity data
  const loadActivityData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [activityData, quizData, reportsData] = await Promise.all([
        fetchChildActivity(studentId),
        fetchQuizScores(studentId),
        fetchReports(studentId)
      ]);

      setActivityData(activityData);
      setQuizScores(quizData);
      setReports(reportsData);

      // Set stats from activity data
      setStats({
        lastActive: activityData.last_active || "1 day ago",
        lastLogin: activityData.last_login || "June 15, 2025",
        timeSpent: activityData.time_spent || "40 mins/day",
        lastModule: activityData.last_module || "Module 2.2 – Social Media Safety",
        recentBadge: activityData.recent_badge || "Safe Clicker"
      });

    } catch (error) {
      console.error('Error loading activity data:', error);
      setError('Failed to load activity data. Please try again.');
      
      // Set fallback data
      setQuizScores([
        { module: "1", score: 85 },
        { module: "2", score: 86 },
        { module: "3", score: 90 },
        { module: "4", score: 84 }
      ]);
      
      setStats({
        lastActive: "1 day ago",
        lastLogin: "June 15, 2025",
        timeSpent: "40 mins/day",
        lastModule: "Module 2.2 – Social Media Safety",
        recentBadge: "Safe Clicker"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadActivityData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Child's Recent Activity</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading child activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Child's Recent Activity</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadActivityData}
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
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Child's Recent Activity</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🕓 Last Active</h4>
          <p className="text-gray-700 text-sm">{stats.lastActive}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📅 Last Login</h4>
          <p className="text-gray-700 text-sm">{stats.lastLogin}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">⏰ Time Spent (Avg)</h4>
          <p className="text-gray-700 text-sm">{stats.timeSpent}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📘 Last Module Watched</h4>
          <p className="text-gray-700 text-sm">{stats.lastModule}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">🏅 Recent Badge</h4>
          <p className="text-gray-700 text-sm">{stats.recentBadge}</p>
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
          <h4 className="text-lg font-semibold mb-1">📊 Total Reports</h4>
          <p className="text-gray-700 text-sm">{reports.length} reports</p>
        </div>
      </div>

      {/* Quiz Chart */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
        <h4 className="text-lg font-semibold mb-4 text-purple-700">📊 Quiz Scores</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={quizScores}>
            <XAxis dataKey="module" label={{ value: "Module", position: "insideBottom", dy: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">Scores out of 10</p>
      </div>

      {/* Recent Reports Section */}
      {reports.length > 0 && (
        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition mt-6">
          <h4 className="text-lg font-semibold mb-4 text-purple-700">📋 Recent Performance Reports</h4>
          <div className="space-y-3">
            {reports.slice(0, 5).map((report, index) => (
              <div key={report.report_id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Quiz {report.quiz_id}</p>
                  <p className="text-sm text-gray-600">Duration: {report.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-700">{report.score}%</p>
                  <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
