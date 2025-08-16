"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
//import { saveAuth } from "@/src/app/utils/auth";
import { getToken } from "@/src/app/utils/auth";
import { getUser } from "@/src/app/utils/auth";

export default function QuizManager() {
  const [module, setModule] = useState("Module 1"); // Replace with module ID if needed
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [] });
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [previousQuizzes, getQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          type: "text",
          question: "",
          options: ["", "", "", ""],
          correct: 0,
          explanation: "",
        },
      ],
    });
  };

  const updateQuestion = (idx, key, value) => {
    const updated = [...newQuiz.questions];
    updated[idx][key] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...newQuiz.questions];
    updated[qIdx].options[oIdx] = value;
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const deleteQuestion = (idx) => {
    const updated = [...newQuiz.questions];
    updated.splice(idx, 1);
    setNewQuiz({ ...newQuiz, questions: updated });
  };

  const saveQuiz = async () => {
    if (!newQuiz.title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }
    if (newQuiz.questions.length === 0) {
      alert("Add at least one question.");
      return;
    }
    const token = getToken();
    const user = getUser();

    // Prepare data for backend
    const payload = {
      title: newQuiz.title,
      mentor_id: user.id,
      module_id: module, // If backend expects a number, convert it
      questions: newQuiz.questions.map((q) => ({
        text: q.question,
        explanation: q.explanation, // Add explanation support later if needed
        options: q.options.map((opt, i) => ({
          text: opt,
          is_correct: i === q.correct,
        })),
      })),
    };

    try {
      const token = getToken();
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/quiz/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      alert("✅ Quiz saved successfully!");
      setQuizzes([...quizzes, { ...newQuiz, module }]);
      setNewQuiz({ title: "", questions: [] });
      setShowQuizForm(false);
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Failed to save quiz. Check console for details.");
    }
  };

  const fetchQuiz = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const user = getUser();
      console.log(user);
      const res = await fetch(`${API_BASE_URL}/api/quiz/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("QUIZ DATA");
      console.log(data);

      const grouped = {
        1: { quiz_id: data.quiz_id, quiz_title: data.title },
        2: { quiz_id: data.quiz_id, quiz_title: data.title },
      };
      // Group users by role
      //const grouped = data.reduce((acc, user) => {
      //  if (!acc[user.role]) acc[user.role] = [];
      //  acc[user.role].push(user);
      //  return acc;
      // }, {});

      getQuizzes(data);
      //console.log("QUIZ DATA");
      //console.log(data.quiz_id);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      console.log("In Finally");
    }
  };
  4;
  useEffect(() => {
    fetchQuiz();
    console.log("Quiz is fetched");
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">📝 Quiz Manager</h3>
      <p className="mb-4 text-gray-700">
        Create and manage quizzes linked to student modules.
      </p>

      <div className="mb-6">
        <label className="font-medium text-sm">Select Module:</label>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="ml-2 border rounded px-3 py-1 text-sm"
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm mb-4"
        onClick={() => setShowQuizForm(true)}
      >
        ➕ Create New Quiz
      </button>
      {showQuizForm && (
        <div className="bg-gray-50 border p-4 rounded shadow space-y-4">
          <input
            type="text"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter quiz title"
          />

          {newQuiz.questions.map((q, idx) => (
            <div key={idx} className="border rounded p-4 bg-white shadow">
              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Question {idx + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(idx, "question", e.target.value)
                  }
                  className="w-full border px-3 py-1 rounded"
                  placeholder="Enter your question"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                {q.options.map((opt, oIdx) => (
                  <input
                    key={oIdx}
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                    className="border px-2 py-1 rounded"
                    placeholder={`Option ${oIdx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm">Correct Option:</label>
                <select
                  value={q.correct}
                  onChange={(e) =>
                    updateQuestion(idx, "correct", parseInt(e.target.value))
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>
                      Option {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm">Explanation:</label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) =>
                    updateQuestion(idx, "explanation", e.target.value)
                  }
                  className="w-full border px-3 py-1 rounded"
                ></input>
              </div>

              <button
                className="mt-3 flex items-center gap-1 text-red-600 hover:underline text-sm"
                onClick={() => deleteQuestion(idx)}
              >
                <Trash2 size={16} /> Delete Question
              </button>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
          >
            ➕ Add Question
          </button>

          <button
            onClick={saveQuiz}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm ml-2"
          >
            💾 Save Quiz
          </button>
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">📚 Saved Quizzes</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {quizzes.map((q, i) => (
              <li key={i}>
                <strong>{q.title}</strong> ({q.module}) – {q.questions.length}{" "}
                questions
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>
        <b>PREVIOUS QUIZZES</b>
      </h2>
      {previousQuizzes.map((quiz) => (
        <div
          key={quiz.quiz_id}
          className="bg-white shadow-md rounded-2xl p-4 mb-4"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() =>
              setExpandedQuiz(
                expandedQuiz === quiz.quiz_id ? null : quiz.quiz_id
              )
            }
          >
            <h2 className="text-xl font-semibold">{quiz.quiz_title}</h2>
            <span className="text-gray-500">
              {expandedQuiz === quiz.quiz_id ? "▲" : "▼"}
            </span>
          </div>
          <p className="text-gray-600">{quiz.module_title}</p>

          {expandedQuiz === quiz.quiz_id && (
            <div className="mt-3 space-y-4">
              {quiz.questions_list.map((q) => (
                <div
                  key={q.question_id}
                  className="border p-3 rounded-lg bg-gray-50"
                >
                  <p className="font-medium">
                    Q{q.question_id}: {q.text}
                  </p>
                  <ul className="list-disc list-inside ml-3 mt-1">
                    {q.options.map((opt) => (
                      <li key={opt.option_id}>{opt.text}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
