"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiHelpers, getUserId } from "../../src/app/utils/apiConfig";

export default function SettingsPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintData, setComplaintData] = useState({
    filed_by: '',
    against: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const settings = [
    { icon: "🔒", label: "Change Password" },
    { icon: "📩", label: "Notification Preferences" },
    { icon: "👨‍👩‍👧", label: "Manage Linked Children" },
    { icon: "🌙", label: "Enable Dark Mode" }
  ];

  // Get user data from JWT token or use default
  const userId = getUserId() || 1;
  const username = "parent_01"; // TODO: get from profile

  // Fetch notifications using API helpers
  const fetchNotifications = async (userId) => {
    try {
      const notificationsData = await apiHelpers.get(`/notifications/${userId}`);
      return notificationsData;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  // File complaint using API helpers
  const fileComplaint = async (complaintData) => {
    try {
      const result = await apiHelpers.post('/complaints/file', complaintData);
      return result;
    } catch (error) {
      console.error('Error filing complaint:', error);
      throw error;
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await fetchNotifications(userId);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  // Handle complaint submission
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await fileComplaint({
        ...complaintData,
        filed_by: username
      });

      // Reset form and close modal
      setComplaintData({
        filed_by: '',
        against: '',
        description: ''
      });
      setShowComplaintModal(false);
      
      // Show success message
      alert('Complaint filed successfully!');
      
    } catch (error) {
      console.error('Error filing complaint:', error);
      setError('Failed to file complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">⚙️ Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {settings.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-md hover:bg-purple-50 transition transform hover:scale-[1.01]"
          >
            <h4 className="text-lg font-semibold mb-2">
              {item.icon} {item.label}
            </h4>
            <p className="text-sm text-gray-600">Manage {item.label.toLowerCase()} settings here.</p>
          </div>
        ))}
      </div>

      {/* Notifications Section */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow mb-8">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">📩 Recent Notifications</h3>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={notification.id || index} className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent notifications</p>
        )}
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={() => setShowComplaintModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700 transition text-sm"
        >
          🚨 Raise a Complaint
        </button>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-4">🚨 File a Complaint</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Against (Person/Service)
                </label>
                <input
                  type="text"
                  value={complaintData.against}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, against: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter name or service"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={complaintData.description}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Describe your complaint in detail..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
