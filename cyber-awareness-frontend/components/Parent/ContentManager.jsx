"use client";

import { useState, useEffect } from "react";
import { apiHelpers, handleApiError, getUserId, isAuthenticated } from "../../src/app/utils/apiConfig";

export default function ParentTips() {
  const [showHelpline, setShowHelpline] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tips, setTips] = useState([]);
  const [viewedTips, setViewedTips] = useState(new Set());

  // Get parent ID from JWT token or use default
  const parentId = getUserId() || 1;

  // Fetch tips with viewed status from backend using API helpers
  const fetchTipsWithViewedStatus = async () => {
    try {
      const tipsData = await apiHelpers.get(`/tips/with-viewed-status/${parentId}`);
      return tipsData;
    } catch (error) {
      console.error('Error fetching tips with viewed status:', error);
      // Return fallback tips if API fails
      return handleApiError(error, [
        { tip_id: 1, title: "Strong Passwords", content: "Use strong, unique passwords for each account.", category: "Security", is_viewed: false },
        { tip_id: 2, title: "Software Updates", content: "Keep software and antivirus tools updated.", category: "Maintenance", is_viewed: false },
        { tip_id: 3, title: "Online Safety Rules", content: "Discuss online safety rules with your children regularly.", category: "Communication", is_viewed: false },
        { tip_id: 4, title: "Screen Time Monitoring", content: "Monitor screen time and online behavior.", category: "Monitoring", is_viewed: false },
        { tip_id: 5, title: "Parental Controls", content: "Enable parental controls on devices.", category: "Controls", is_viewed: false },
        { tip_id: 6, title: "Suspicious Links", content: "Teach kids to avoid suspicious links and messages.", category: "Education", is_viewed: false }
      ]);
    }
  };

  // Mark tip as viewed using API helpers
  const markTipViewed = async (tipId) => {
    try {
      const result = await apiHelpers.post('/tips/viewed', {
        parent_id: parentId,
        tip_id: tipId
      });
      
      console.log('Tip marked as viewed:', result);
      
      // Update local state
      setViewedTips(prev => new Set([...prev, tipId]));
      
      // Update the tip in the tips array to mark it as viewed
      setTips(prevTips => 
        prevTips.map(tip => 
          tip.tip_id === tipId 
            ? { ...tip, is_viewed: true }
            : tip
        )
      );
      
    } catch (error) {
      console.error('Error marking tip as viewed:', error);
      // Still update local state for better UX
      setViewedTips(prev => new Set([...prev, tipId]));
    }
  };

  // Load tips on component mount
  useEffect(() => {
    const loadTips = async () => {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('ContentManager: User not authenticated, showing fallback tips');
        setTips([
          { tip_id: 1, title: "Strong Passwords", content: "Use strong, unique passwords for each account.", category: "Security", is_viewed: false },
          { tip_id: 2, title: "Software Updates", content: "Keep software and antivirus tools updated.", category: "Maintenance", is_viewed: false },
          { tip_id: 3, title: "Online Safety Rules", content: "Discuss online safety rules with your children regularly.", category: "Communication", is_viewed: false },
          { tip_id: 4, title: "Screen Time Monitoring", content: "Monitor screen time and online behavior.", category: "Monitoring", is_viewed: false },
          { tip_id: 5, title: "Parental Controls", content: "Enable parental controls on devices.", category: "Controls", is_viewed: false },
          { tip_id: 6, title: "Suspicious Links", content: "Teach kids to avoid suspicious links and messages.", category: "Education", is_viewed: false }
        ]);
        setLoading(false);
        return;
      }
      
      try {
        const tipsData = await fetchTipsWithViewedStatus();
        setTips(tipsData);
        
        // Initialize viewed tips set from the API response
        const viewedTipIds = new Set();
        tipsData.forEach(tip => {
          if (tip.is_viewed) {
            viewedTipIds.add(tip.tip_id);
          }
        });
        setViewedTips(viewedTipIds);
        
      } catch (error) {
        console.error('Error loading tips:', error);
        setError('Failed to load tips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  // Handle tip click
  const handleTipClick = (tipId) => {
    markTipViewed(tipId);
  };

  if (loading) {
    return (
      <div className="relative p-8 text-purple-900 min-h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🛡️ Cybersecurity Tips</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cybersecurity tips...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative p-8 text-purple-900 min-h-screen">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">🛡️ Cybersecurity Tips</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🛡️ Cybersecurity Tips</h2>

      {/* Tips as interactive boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tips.map((tip, index) => {
          const isViewed = tip.is_viewed || viewedTips.has(tip.tip_id);
          
          return (
            <div
              key={tip.tip_id || index}
              className={`border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer ${
                isViewed 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-white border-purple-200 hover:bg-purple-50'
              }`}
              onClick={() => handleTipClick(tip.tip_id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-black">{tip.title || tip.content}</h3>
                {isViewed && (
                  <span className="text-green-600 text-sm">✓ Viewed</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{tip.content}</p>
              {tip.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  {tip.category}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Button */}
      <div className="absolute left-8 bottom-6">
        <button
          onClick={() => setShowVideos(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ▶️ Watch Cybersecurity Videos
        </button>
      </div>

      {/* Helpline Box */}
      <div className="absolute right-8 bottom-6">
        <button
          onClick={() => setShowHelpline(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          📞 Child Safety Helpline
        </button>
      </div>

      {/* Popup: Helpline */}
      {showHelpline && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-700">🚨 Child Safety Helpline</h3>
            <p className="text-gray-800 text-sm">If your child is in danger or needs help, please call:</p>
            <p className="text-xl font-bold text-red-600">1098</p>
            <button
              className="mt-4 text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowHelpline(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup: YouTube Videos */}
      {showVideos && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full space-y-4">
            <h3 className="text-lg font-semibold text-blue-700">🔐 Recommended Videos</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/nMpcKqQ2vBY"
                title="Cyber Safety for Parents"
                allowFullScreen
              ></iframe>
              <iframe
                className="w-full aspect-video rounded"
                src="https://www.youtube.com/embed/1nPtMpbG0q8"
                title="Internet Safety Tips for Kids"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-right">
              <button
                onClick={() => setShowVideos(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
