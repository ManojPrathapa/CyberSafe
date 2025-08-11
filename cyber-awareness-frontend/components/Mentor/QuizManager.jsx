"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/api";
//import { saveAuth } from "@/src/app/utils/auth";
import { getToken } from "@/src/app/utils/auth";

export default function QuizManager() {
  const [module, setModule] = useState("Module 1"); // Replace with module ID if needed
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [] });
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [previousQuizzes,getQuizzes]=useState([])

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

    // Prepare data for backend
    const payload = {
      title: newQuiz.title,
      module_id: module, // If backend expects a number, convert it
      questions: newQuiz.questions.map((q) => ({
        text: q.question,
        explanation: "", // Add explanation support later if needed
        options: q.options.map((opt, i) => ({
          text: opt,
          is_correct: i === q.correct,
        })),
      })),
    };

    try {
      const token = getToken();
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
                const res = await fetch(`${API_BASE_URL}/api/quiz/2`, {
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


        const grouped={
          "1":{"quiz_id":data.quiz_id, "quiz_title":data.title},
          "2":{"quiz_id":data.quiz_id, "quiz_title":data.title}
        }
        // Group users by role
        //const grouped = data.reduce((acc, user) => {
        //  if (!acc[user.role]) acc[user.role] = [];
        //  acc[user.role].push(user);
        //  return acc;
       // }, {});

        getQuizzes(grouped)
        console.log("QUIZ DATA")
        console.log(data.quiz_id)
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        console.log("In Finally");
      }
    };4
    useEffect(() => {
    fetchQuiz();
    console.log("Quiz is fetched")
  }, []);
      




  return (
    <div className="bg-white p-6 rounded-lg shadow text-purple-900">
      <h3 className="text-2xl font-bold mb-4">📝 Quiz Manager</h3>
      <p className="mb-4 text-gray-700">Create and manage quizzes linked to student modules.</p>

      <div className="mb-6">
        <label className="font-medium text-sm">Select Module:</label>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="ml-2 border rounded px-3 py-1 text-sm"
        >
          <option>Module 1</option>
          <option>Module 2</option>
          <option>Module 3</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm mb-4"
        onClick={() => setShowQuizForm(true)}
      >
        ➕ Create New Quiz
      </button>

      <h3>PREVIOUS QUIZZES</h3>
      {Object.keys(previousQuizzes).length === 0 ? (
        <p>No Previous Quizzes found.</p>
      ) : (
        Object.entries(previousQuizzes).map(([sr_no,quiz]) => (
          <div key={sr_no} className="mb-6">
            <h4>ID: {sr_no}</h4>
            <h4>Quiz ID: {quiz.quiz_id}</h4>
            <h4>Quiz ID: {quiz.quiz_title}</h4>
            {/*<h4> {quiz_id}</h4>*/}
            {/*<h4>{quiz_title}*/}


         {/* Desktop Table View *
          *  <div className="hidden md:block overflow-x-auto">
          *    <table className="w-full border border-gray-200 rounded">
          *     <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
        
                </thead>
                <tbody>
                  {roleUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleWarn(user.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Block
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View 
            <div className="md:hidden space-y-4">
              {roleUsers.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-3 shadow-sm bg-gray-50"
                >
                  <p className="text-sm">
                    <span className="font-bold">ID:</span> {user.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Username:</span> {user.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Email:</span> {user.email}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => handleWarn(user.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Block
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>*/}
          </div>
        ))
      )}






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
                <label className="block text-sm font-medium">Question {idx + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, "question", e.target.value)}
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
                  onChange={(e) => updateQuestion(idx, "correct", parseInt(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
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
                <strong>{q.title}</strong> ({q.module}) – {q.questions.length} questions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
