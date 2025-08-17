"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { ChevronDown } from "lucide-react";

export default function ContentApproval() {
  const [pendingVideos, setPendingVideos] = useState([]);
  const [openVideo, setOpenVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch pending videos
  const fetchPendingVideos = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/videos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setPendingVideos(data.filter((v) => v.isApproved === 0));
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  // Approve a video
  const approveVideo = async (videoId) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/approve/${videoId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      alert("Video approved successfully!");
      setPendingVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error("Video Approval Failed:", error);
      alert("Failed to approve video.");
    }
  };

  useEffect(() => {
    fetchPendingVideos();
  }, []);

  if (loading) {
    return <p className="p-4">Loading pending videos...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h2 className="text-xl font-bold mb-4">Pending Video Approvals</h2>

      {pendingVideos.length === 0 ? (
        <p>No videos pending approval ✅</p>
      ) : (
        pendingVideos.map((video, index) => (
          <div key={video.id} className="mb-4 border rounded shadow-sm">
            <button
              onClick={() => setOpenVideo(openVideo === index ? null : index)}
              className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
            >
              <span className="text-lg font-semibold">{video.title}</span>
              <ChevronDown
                className={`transform transition ${
                  openVideo === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {openVideo === index && (
              <div className="p-4 space-y-2 bg-blue-50 border-t">
                <p><strong>Description:</strong> {video.description}</p>
                <video
                  src={video.video_url}
                  controls
                  className="mt-2 w-64 rounded-lg shadow"
                />
                <button
                  onClick={() => approveVideo(video.id)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
