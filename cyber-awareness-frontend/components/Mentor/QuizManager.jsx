"use client";

import { useState } from "react";
import { Plus, Trash2, Save, UploadCloud } from "lucide-react";

export default function QuizManager() {
  const [module, setModule] = useState("Module 1");
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", questions: [] });
  const [showQuizForm, setShowQuizForm] = useState(false);

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
          image: null
        }
      ]
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

  const saveQuiz = () => {
    setQuizzes([...quizzes, { ...newQuiz, module }]);
    setNewQuiz({ title: "", questions: [] });
    setShowQuizForm(false);
  };

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
              <div className="mt-2">
                <label className="block text-sm mb-1">Image (optional):</label>
                <input
                  type="file"
                  onChange={(e) => updateQuestion(idx, "image", e.target.files[0])}
                  className="block w-full text-sm"
                />
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

      {/* Display Existing Quizzes */}
      {quizzes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">📚 Saved Quizzes</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {quizzes.map((q, i) => (
              <li key={i}><strong>{q.title}</strong> ({q.module}) – {q.questions.length} questions</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
