"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken, getUser } from "@/src/app/utils/auth";
import QuizManager from "./QuizManager";

export default function ContentManager() {
  const [openModule, setOpenModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch once
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/modules_with_content`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch modules: ${res.status}`);
        }

        const data = await res.json();
        setModules(data || []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const student = getUser() || {}; // compute once

  if (loading) {
    return <p className="text-gray-500">Loading modules...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">📂 Content Modules</h3>
      <p className="mb-6 text-sm text-gray-700">
        All your content materials, quizzes, and modules here.
      </p>

      {modules.length === 0 ? (
        <p className="text-gray-500">No modules found.</p>
      ) : (
        modules.map((mod, index) => {
          // prefer stable id as key; fallback to index only if module_id missing
          const moduleKey = mod.module_id ?? `module-${index}`;

          return (
            <div key={moduleKey} className="mb-4 border rounded shadow-sm">
              <button
                onClick={() => setOpenModule(openModule === moduleKey ? null : moduleKey)}
                className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
              >
                <span className="text-lg font-semibold">{mod.title}</span>
                <ChevronDown
                  className={`transform transition ${openModule === moduleKey ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              {openModule === moduleKey && (
                <div className="p-4 space-y-6 bg-blue-50 border-t">
                  {/* Videos */}
                  <div>
                    <h4 className="font-semibold">🎥 Videos:</h4>
                    {Array.isArray(mod.videos) && mod.videos.length > 0 ? (
                      <ul className="space-y-4 ml-2 text-sm">
                        {mod.videos.map((v, vIdx) => (
                          <li key={v.video_id ?? `video-${moduleKey}-${vIdx}`} className="space-y-2">
                            <p className="font-medium">{v.title}</p>
                            {v.video_url ? (
                              <video
                                src={`http://127.0.0.1:5050/${v.video_url}`}
                                controls
                                className="w-full max-w-lg rounded shadow"
                              />
                            ) : (
                              <p className="text-gray-500">No video file available</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No videos available</p>
                    )}
                  </div>

                  {/* Quizzes */}
                  <div>
                    <h4 className="font-semibold">📝 Quizzes:</h4>

                    {/* Preferred: render ONE QuizManager per module */}
                    {Array.isArray(mod.quizzes) && mod.quizzes.length > 0 ? (
                      <div className="space-y-4">
                        {/* Pass moduleId and studentId; give QuizManager a stable key */}
                        <QuizManager
                          key={`quiz-manager-${moduleKey}`}
                          moduleId={mod.module_id}
                          studentId={student.id}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No quizzes available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
