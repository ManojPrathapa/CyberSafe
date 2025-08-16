"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/api";
import { getToken } from "@/src/app/utils/auth";

export default function ContentManager() {
  const [openModule, setOpenModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch modules with content
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/modules_with_content`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch modules: ${res.status}`);
        }

        const data = await res.json();
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

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
        modules.map((mod, index) => (
          <div key={mod.module_id || index} className="mb-4 border rounded shadow-sm">
            <button
              onClick={() =>
                setOpenModule(openModule === index ? null : index)
              }
              className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t"
            >
              <span className="text-lg font-semibold">{mod.title}</span>
              <ChevronDown
                className={`transform transition ${
                  openModule === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {openModule === index && (
              <div className="p-4 space-y-4 bg-blue-50 border-t">
                {/* Videos */}
                <div>
                  <h4 className="font-semibold">🎥 Videos:</h4>
                  {mod.videos && mod.videos.length > 0 ? (
                    <ul className="list-disc list-inside ml-4 text-sm">
                      {mod.videos.map((v) => (
                        <li key={v.video_id}>
                          {v.url ? (
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {v.title}
                            </a>
                          ) : (
                            v.title
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
                  {mod.quizzes && mod.quizzes.length > 0 ? (
                    <ul className="list-disc list-inside ml-4 text-sm">
                      {mod.quizzes.map((q) => (
                        <li key={q.quiz_id}>{q.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No quizzes available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}