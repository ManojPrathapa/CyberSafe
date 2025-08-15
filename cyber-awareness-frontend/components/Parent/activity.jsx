"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { apiHelpers, handleApiError, getUserId, isAuthenticated } from "../../src/app/utils/apiConfig";

export default function ChildActivity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childrenActivity, setChildrenActivity] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reports, setReports] = useState([]);

  // Get parent ID from JWT token
  const parentId = getUserId();

  // Fetch all children's activity data
  const fetchChildrenActivity = async (parentId) => {
    try {
      const activityData = await apiHelpers.get(`/activity/parent-children/${parentId}`);
      return activityData;
    } catch (error) {
      console.error('Error fetching children activity:', error);
      return handleApiError(error, []);
    }
  };

  // Fetch reports for a specific child
  const fetchChildReports = async (studentId) => {
    try {
      const reportsData = await apiHelpers.get(`/reports/${studentId}`);
      return reportsData;
    } catch (error) {
      console.error('Error fetching child reports:', error);
      return [];
    }
  };

  // Load all activity data
  const loadActivityData = async () => {
    setLoading(true);
    setError(null);
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log('ChildActivity: User not authenticated, showing fallback data');
      setChildrenActivity([
        {
          student_id: 1,
          username: "student1",
          email: "student1@example.com",
          last_active: "2 hours ago",
          login_count: 15,
          time_spent: "180 mins total",
          last_module: "Module 1 - Cyber Hygiene",
          recent_badge: "Cyber Champion",
          last_login: "August 15, 2025",
          quiz_attempts: [
            { module: "1", score: 85 },
            { module: "2", score: 86 },
            { module: "3", score: 90 },
            { module: "4", score: 84 }
          ]
        }
      ]);
      setSelectedChild(1);
      setLoading(false);
      return;
    }
    
    try {
      const activityData = await fetchChildrenActivity(parentId);
      setChildrenActivity(activityData);
      
      // Select the first child by default and load reports in parallel
      if (activityData.length > 0) {
        const firstChildId = activityData[0].student_id;
        setSelectedChild(firstChildId);
        
        // Load reports for the first child in parallel
        fetchChildReports(firstChildId).then(reportsData => {
          setReports(reportsData);
        }).catch(error => {
          console.error('Error loading child reports:', error);
          setReports([]);
        });
      }
      
    } catch (error) {
      console.error('Error loading activity data:', error);
      setError('Failed to load activity data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle child selection
  const handleChildSelect = async (childId) => {
    setSelectedChild(childId);
    try {
      const reportsData = await fetchChildReports(childId);
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading child reports:', error);
      setReports([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadActivityData();
  }, []);

  // Get selected child data
  const selectedChildData = childrenActivity.find(child => child.student_id === selectedChild);

  // Prepare quiz data for chart
  const prepareQuizData = (quizAttempts) => {
    if (!quizAttempts || quizAttempts.length === 0) return [];
    
    // Group by module and calculate average score
    const moduleScores = {};
    quizAttempts.forEach(attempt => {
      const moduleId = attempt.quiz_id || attempt.module || 'Unknown';
      if (!moduleScores[moduleId]) {
        moduleScores[moduleId] = [];
      }
      moduleScores[moduleId].push(attempt.score || 0);
    });
    
    return Object.entries(moduleScores).map(([module, scores]) => ({
      module: `Module ${module}`,
      score: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100)
    }));
  };

  // Prepare activity summary data for pie chart
  const prepareActivitySummary = (childData) => {
    if (!childData) return [];
    
    const totalAttempts = childData.quiz_attempts?.length || 0;
    const modulesCompleted = childData.modules_viewed?.length || 0;
    const loginCount = childData.login_count || 0;
    
    return [
      { name: 'Quiz Attempts', value: totalAttempts, color: '#8884d8' },
      { name: 'Modules Completed', value: modulesCompleted, color: '#82ca9d' },
      { name: 'Login Sessions', value: loginCount, color: '#ffc658' }
    ];
  };

  if (loading) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Children's Activity</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading children's activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Children's Activity</h2>
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

  if (childrenActivity.length === 0) {
    return (
      <div className="p-8 text-purple-900">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Children's Activity</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700 text-lg">No children linked to your account</p>
          <p className="text-yellow-600 mt-2">Please link children to your account to view their activity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-purple-900">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Children's Activity</h2>

      {/* Child Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Child:
        </label>
        <select
          value={selectedChild || ''}
          onChange={(e) => handleChildSelect(parseInt(e.target.value))}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          {childrenActivity.map((child) => (
            <option key={child.student_id} value={child.student_id}>
              {child.username}
            </option>
          ))}
        </select>
      </div>

      {selectedChildData && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">🕓 Last Active</h4>
              <p className="text-gray-700 text-sm">{selectedChildData.last_active}</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">📅 Last Login</h4>
              <p className="text-gray-700 text-sm">{selectedChildData.last_login}</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">⏰ Time Spent</h4>
              <p className="text-gray-700 text-sm">{selectedChildData.time_spent}</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">📘 Last Module</h4>
              <p className="text-gray-700 text-sm">{selectedChildData.last_module}</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">🏅 Recent Badge</h4>
              <p className="text-gray-700 text-sm">{selectedChildData.recent_badge}</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition">
              <h4 className="text-lg font-semibold mb-1">📊 Total Reports</h4>
              <p className="text-gray-700 text-sm">{reports.length} reports</p>
            </div>
          </div>

          {/* Activity Summary Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-4 text-purple-700">📊 Activity Summary</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={prepareActivitySummary(selectedChildData)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {prepareActivitySummary(selectedChildData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quiz Performance Chart */}
            <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-4 text-purple-700">📊 Quiz Performance</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prepareQuizData(selectedChildData.quiz_attempts)}>
                  <XAxis dataKey="module" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">Scores out of 100</p>
            </div>
          </div>

          {/* Recent Reports Section */}
          {reports.length > 0 && (
            <div className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-lg transition">
              <h4 className="text-lg font-semibold mb-4 text-purple-700">📋 Recent Performance Reports</h4>
              <div className="space-y-3">
                {reports.slice(0, 5).map((report, index) => (
                  <div key={report.report_id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{report.quiz_title || `Quiz ${report.quiz_id}`}</p>
                      <p className="text-sm text-gray-600">Duration: {report.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-700">{report.score_percentage || Math.round((report.score || 0) * 100)}%</p>
                      <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Reports Message */}
          {reports.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No performance reports available for this child yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
