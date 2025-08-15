"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiHelpers, getUserId } from "../../src/app/utils/apiConfig";
import NotificationPreferences from "./NotificationPreferences";
import ThemeSettings from "./ThemeSettings";

export default function SettingsPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [activePanel, setActivePanel] = useState('main'); // 'main', 'notifications', 'theme', or 'children'
  const [complaintData, setComplaintData] = useState({
    filed_by: '',
    against: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Child management states
  const [children, setChildren] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [removingChild, setRemovingChild] = useState(null);
  const [message, setMessage] = useState(null);

  const settings = [
    { 
      icon: "🔒", 
      label: "Change Password",
      action: () => handleChangePassword()
    },
    { 
      icon: "📩", 
      label: "Notification Preferences",
      action: () => handleNotificationPreferences()
    },
    { 
      icon: "👨‍👩‍👧", 
      label: "Manage Linked Children",
      action: () => handleManageChildren()
    },
    { 
      icon: "🌙", 
      label: "Theme Settings",
      action: () => handleDarkMode()
    }
  ];

  // Get user data from JWT token or use default
  const userId = getUserId() || 1;
  const username = "parent_01"; // TODO: get from profile

  // Fetch linked children
  const fetchLinkedChildren = async () => {
    try {
      const children = await apiHelpers.get(`/parents/children/${userId}`);
      return children || [];
    } catch (error) {
      console.error('Error fetching linked children:', error);
      return [];
    }
  };

  // Fetch available students for selection
  const fetchAvailableStudents = async () => {
    try {
      const students = await apiHelpers.get(`/parents/available-students/${userId}`);
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error('Error fetching available students:', error);
      return [];
    }
  };

  // Load children data
  const loadChildrenData = async () => {
    try {
      const [childrenData, availableStudentsData] = await Promise.all([
        fetchLinkedChildren(),
        fetchAvailableStudents()
      ]);

      setChildren(childrenData.map(child => ({
        id: child.id,
        name: child.username,
        email: child.email,
        grade: child.age ? `Grade ${child.age}` : "Grade N/A"
      })));

      setAvailableStudents(availableStudentsData);
    } catch (error) {
      console.error('Error loading children data:', error);
      setMessage({ type: 'error', text: 'Failed to load children data.' });
    }
  };

  // Settings action handlers
  const handleChangePassword = async () => {
    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;
    
    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      setLoading(true);
      await apiHelpers.post('/profile/edit', {
        user_id: userId,
        password: newPassword
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPreferences = () => {
    setActivePanel('notifications');
  };

  const handleManageChildren = async () => {
    setActivePanel('children');
    setMessage(null);
    await loadChildrenData();
  };

  const handleDarkMode = () => {
    setActivePanel('theme');
  };

  // Child management handlers
  const handleAddChild = async () => {
    if (!selectedStudent) {
      setMessage({ type: 'error', text: 'Please select a student to add.' });
      return;
    }

    setAddingChild(true);
    try {
      await apiHelpers.post('/parents/link', {
        parent_id: userId,
        student_id: parseInt(selectedStudent)
      });

      // Reload children data
      await loadChildrenData();
      
      setSelectedStudent("");
      setMessage({ type: 'success', text: 'Child added successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error adding child:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to add child. Please try again.' 
      });
    } finally {
      setAddingChild(false);
    }
  };

  const handleRemoveChild = async (childId) => {
    if (!confirm('Are you sure you want to remove this child from your account?')) {
      return;
    }

    setRemovingChild(childId);
    try {
      await apiHelpers.post('/parents/unlink', {
        parent_id: userId,
        student_id: childId
      });

      // Reload children data
      await loadChildrenData();
      
      setMessage({ type: 'success', text: 'Child removed successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error removing child:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to remove child. Please try again.' 
      });
    } finally {
      setRemovingChild(null);
    }
  };

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
        filed_by: userId, // Send user ID instead of username
        against: parseInt(complaintData.against) || 1, // Convert to integer, default to 1 if invalid
        description: complaintData.description
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

  // Show notification preferences panel
  if (activePanel === 'notifications') {
    return (
      <div className="p-6">
        <button 
          onClick={() => setActivePanel('main')}
          className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          ← Back to Settings
        </button>
        <NotificationPreferences />
      </div>
    );
  }

  // Show theme settings panel
  if (activePanel === 'theme') {
    return (
      <div className="p-6">
        <button 
          onClick={() => setActivePanel('main')}
          className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          ← Back to Settings
        </button>
        <ThemeSettings />
      </div>
    );
  }

  // Show child management panel
  if (activePanel === 'children') {
    return (
      <div className="p-6">
        <button 
          onClick={() => setActivePanel('main')}
          className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          ← Back to Settings
        </button>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-purple-700 mb-2">👨‍👩‍👧 Manage Linked Children</h3>
          <p className="text-gray-600">Add or remove children from your account</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : message.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Linked Children Section */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow mb-6">
          <h4 className="text-lg font-semibold text-purple-700 mb-4">Currently Linked Children</h4>
          {children.length === 0 ? (
            <p className="text-gray-500 text-sm">No children linked yet. Add a child below to get started.</p>
          ) : (
            <div className="space-y-3">
              {children.map(child => (
                <div
                  key={child.id}
                  className="flex justify-between items-center bg-purple-50 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    {child.email && <p className="text-gray-600 text-sm">{child.email}</p>}
                    <p className="text-gray-600 text-sm">{child.grade}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveChild(child.id)}
                    disabled={removingChild === child.id}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                  >
                    {removingChild === child.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Child Section */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow">
          <h4 className="text-lg font-semibold text-purple-700 mb-4">Add New Child</h4>
          
          {availableStudents.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">No available students to add.</p>
              <p className="text-gray-400 text-sm">All students may already be linked to parents.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a student to add:
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a student...</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.username} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddChild}
                disabled={!selectedStudent || addingChild}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {addingChild ? 'Adding...' : 'Add Child'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">⚙️ Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {settings.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            className="bg-white border border-purple-200 rounded-lg p-6 shadow hover:shadow-md hover:bg-purple-50 transition transform hover:scale-[1.01] cursor-pointer"
          >
            <h4 className="text-lg font-semibold mb-2">
              {item.icon} {item.label}
            </h4>
            <p className="text-sm text-gray-600">Manage {item.label.toLowerCase()} settings here.</p>
            <p className="text-xs text-purple-500 mt-2">Click to configure →</p>
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
                  Against (User ID)
                </label>
                <input
                  type="number"
                  value={complaintData.against}
                  onChange={(e) => setComplaintData(prev => ({ ...prev, against: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter user ID (e.g., 1, 2, 3...)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the user ID of the person you want to file a complaint against
                </p>
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
