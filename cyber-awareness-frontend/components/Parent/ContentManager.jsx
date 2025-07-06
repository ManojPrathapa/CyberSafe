"use client";

import { useState } from "react";

export default function ParentTips() {
  const [showHelpline, setShowHelpline] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  const tips = [
    "Use strong, unique passwords for each account.",
    "Keep software and antivirus tools updated.",
    "Discuss online safety rules with your children regularly.",
    "Monitor screen time and online behavior.",
    "Enable parental controls on devices.",
    "Teach kids to avoid suspicious links and messages."
  ];

  return (
    <div className="relative p-8 text-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🛡️ Cybersecurity Tips</h2>

      {/* Tips as interactive boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white border border-purple-200 rounded-lg p-4 shadow hover:shadow-md hover:bg-purple-50 transition"
          >
            <p className="text-sm">{tip}</p>
          </div>
        ))}
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
