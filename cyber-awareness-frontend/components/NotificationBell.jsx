"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { apiHelpers, getUserId } from '../src/app/utils/apiConfig';

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserId();
      if (!userId) {
        console.log('No user ID found, skipping notification fetch');
        return;
      }

      const response = await apiHelpers.get(`/notifications/${userId}`);
      setNotifications(response || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
      // Fallback to empty array
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return '🚨';
      case 'doubt': return '❓';
      case 'complaint': return '⚠️';
      case 'quiz': return '📝';
      case 'admin': return '👨‍💼';
      case 'mentor': return '👨‍🏫';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center focus:outline-none relative"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute top-14 right-0 w-80 bg-white shadow-lg rounded-lg p-4 z-20 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-purple-700">Notifications</h4>
            <button
              onClick={fetchNotifications}
              className="text-xs text-purple-600 hover:text-purple-800"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notification, index) => (
                  <li 
                    key={notification.id || index} 
                    className={`text-sm border-b pb-2 last:border-b-0 ${
                      !notification.isRead ? 'bg-blue-50 p-2 rounded' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="text-gray-700">{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 