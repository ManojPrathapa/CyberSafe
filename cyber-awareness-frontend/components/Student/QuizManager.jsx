"use client";
import React, { useEffect, useState } from "react";
import { getToken, getUser } from "@/src/app/utils/auth";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";

export default function QuizManager({ moduleId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(null); // track which quiz is open

  // Fetch quizzes for the module
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/modules/${moduleId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setMessage("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) fetchQuizzes();
  }, [moduleId]);

  // Handle option select
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Toggle expand/collapse
  const toggleExpand = (quizId) => {
    setExpanded((prev) => (prev === quizId ? null : quizId));
  };

  // Submit answers
  const handleSubmit = async (quizId) => {
    try {
      const token = getToken();
      const user = getUser();

      const payload = {
        quiz_id: quizId,
        student_id: user?.id,
        answers: answers, // { question_id: option_id }
      };

      const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error: ${response.status} - ${errText}`);
      }

      const result = await response.json();
      setMessage(`✅ Submitted! Score: ${result.score}/${result.total}`);
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Failed to submit quiz.");
    }
  };

  if (loading) return <p className="text-gray-600">Loading quizzes...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Module Quizzes</h2>

      {quizzes.length === 0 && (
        <p className="text-gray-500">No quizzes available for this module.</p>
      )}

      {quizzes.map((quiz) => (
        <div
          key={quiz.quiz_id}
          className="border rounded-xl p-4 mb-6 shadow-sm bg-white"
        >
          {/* Quiz Header (click to expand/collapse) */}
          <div
            onClick={() => toggleExpand(quiz.quiz_id)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className="font-semibold text-lg">{quiz.quiz_title}</h3>
            <span className="text-sm text-blue-600">
              {expanded === quiz.quiz_id ? "▲ Hide" : "▼ Expand"}
            </span>
          </div>

          {/* Expandable content */}
          {expanded === quiz.quiz_id && (
            <div className="mt-4">
              {quiz.questions_list.map((q) => (
                <div
                  key={q.question_id}
                  className="border-t pt-3 mt-3 first:border-0 first:pt-0 first:mt-0"
                >
                  <p className="font-medium mb-2">{q.text}</p>
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt.option_id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={`question-${q.question_id}`}
                          value={opt.option_id}
                          checked={answers[q.question_id] === opt.option_id}
                          onChange={() =>
                            handleAnswerChange(q.question_id, opt.option_id)
                          }
                          className="mr-2"
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleSubmit(quiz.quiz_id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Submit This Quiz
              </button>
            </div>
          )}
        </div>
      ))}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
