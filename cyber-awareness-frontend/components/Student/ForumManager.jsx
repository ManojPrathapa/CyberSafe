"use client";

import { useState, useEffect } from "react";
import { Send, Edit3, Save, Trash2, MessageCircle } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/api";
import { getUser, getToken } from "@/src/app/utils/auth";

export default function DoubtsPanel() {
  const [doubts, setDoubts] = useState([]);
  const [question, setQuestion] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken();
  const user = getUser();

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/doubts/student/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch doubts");
      const data = await res.json();
      setDoubts(data.filter((d) => String(d.student_id) === String(user.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      fetchDoubts();
    }
  }, []);

  const handleAskDoubt = async () => {
    if (!question.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/doubts/ask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.id,
          mentor_id: 4, // Example: assign to a default mentor or chosen from UI
          module_id: 1, // Example: assign to a module or choose from UI
          question: question.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to post doubt");
      setQuestion("");
      fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this doubt?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/doubts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete doubt");
      fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      // Soft delete old
      await fetch(`${API_BASE_URL}/doubts/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create new doubt
      await fetch(`${API_BASE_URL}/doubts/ask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: user.id,
          mentor_id: 4,
          module_id: 1,
          question: editText.trim(),
        }),
      });

      setEditId(null);
      setEditText("");
      fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto text-gray-800">
      <h3 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <MessageCircle size={28} /> My Doubts
      </h3>

      {/* Ask Doubt */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3 mb-6">
        <textarea
          placeholder="Type your doubt..."
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAskDoubt}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <Send size={18} /> Submit
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading doubts...</p>
      ) : doubts.length === 0 ? (
        <p className="text-gray-500">No doubts found.</p>
      ) : (
        <ul className="space-y-3">
          {doubts.map((d) => (
            <li
              key={d.doubt_id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              {editId === d.doubt_id ? (
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleEdit(d.doubt_id)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              ) : (
                <p className="flex-1">{d.question}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(d.doubt_id);
                    setEditText(d.question);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(d.doubt_id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
