"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getToken } from "@/src/app/utils/auth";

export default function QuizManager({ moduleId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/modules/${moduleId}/quizzes`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch quizzes");
        const data = await res.json();
        setQuizzes(data || []);   // ✅ fallback to empty array
      } catch (err) {
        console.error(err);
        setQuizzes([]);           // ✅ ensure no undefined
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuizzes();
  }, [moduleId]);

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Quizzes</h3>

      {quizzes && quizzes.length > 0 ? (   // ✅ safe check
        <ul className="list-disc pl-5 space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <p>{quiz.question}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No quizzes available</p>
      )}
    </div>
  );
}
