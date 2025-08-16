"use client";

import { useState, useEffect } from "react";
import { Send, Edit3, Save, Trash2, MessageCircle } from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getUser, getToken } from "@/src/app/utils/auth";

export default function ForumManager() {
  const [doubts, setDoubts] = useState([]);
  const [question, setQuestion] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null); // mentor object returned from API
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editModule, setEditModule] = useState("");
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);

  const token = getToken();
  const user = getUser();

  // HEADERS helper including Authorization for all calls
  const authHeaders = (isJson = true) => {
    const h = { Authorization: `Bearer ${token}` };
    if (isJson) h["Content-Type"] = "application/json";
    return h;
  };

  useEffect(() => {
    // fetch modules list (AUTH header included)
    const fetchModules = async () => {
      try {
        setMetaLoading(true);
        const res = await fetch(`${API_BASE_URL}/modules`, {
          headers: authHeaders(false),
        });
        if (!res.ok) throw new Error("Failed to load modules");
        const mods = await res.json();
        setModules(mods);

        if (mods && mods.length > 0) {
          const first = mods[0].module_id ?? mods[0].id;
          setSelectedModule(first);
          await fetchMentorForModule(first);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setMetaLoading(false);
      }
    };

    // only attempt if token exists
    if (token) fetchModules();
  }, [token]);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/student/doubts`, {
        headers: authHeaders(false),
      });
      if (!res.ok) throw new Error("Failed to fetch doubts");
      const data = await res.json();
      setDoubts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDoubts();
  }, [token]);

  // fetch mentor for a module via API (AUTH header included)
  const fetchMentorForModule = async (moduleId) => {
    if (!moduleId) {
      setSelectedMentor(null);
      return;
    }
    try {
      setError(null);
      setSelectedMentor(null);
      const res = await fetch(`${API_BASE_URL}/modules/${moduleId}/mentor`, {
        headers: authHeaders(false),
      });
      if (!res.ok) {
        // no mentor / fallback handled by backend; treat missing gracefully
        setSelectedMentor(null);
        return;
      }
      const mentor = await res.json();
      setSelectedMentor(mentor);
    } catch (err) {
      setError("Failed to fetch mentor: " + err.message);
    }
  };

  const handleModuleChange = (modId) => {
    setSelectedModule(modId);
    fetchMentorForModule(modId);
  };

  const handleAskDoubt = async () => {
    setError(null);
    if (!question.trim()) {
      setError("Please type your doubt");
      return;
    }
    if (!selectedModule) {
      setError("Please select a module");
      return;
    }
    if (!selectedMentor || !selectedMentor.mentor_id) {
      setError("No mentor assigned for this module. Please try another module or contact support.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/student/doubts`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({
          mentor_id: selectedMentor.mentor_id,
          module_id: selectedModule,
          question: question.trim(),
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to post doubt");
      }
      setQuestion("");
      await fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    if (!confirm("Delete this doubt?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/student/doubts/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (!res.ok) throw new Error("Failed to delete doubt");
      await fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (d) => {
    setEditId(d.doubt_id);
    setEditText(d.question);
    setEditModule(d.module_id);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
    setEditModule("");
  };

  const handleEditSave = async (id) => {
    setError(null);
    if (!editText.trim()) return setError("Question cannot be empty");
    if (!editModule) return setError("Please choose a module");

    try {
      const res = await fetch(`${API_BASE_URL}/student/doubts/${id}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify({
          question: editText.trim(),
          module_id: editModule,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update doubt");
      }
      cancelEdit();
      await fetchDoubts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto text-gray-800">
      <h3 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <MessageCircle size={28} /> My Doubts (Forum)
      </h3>

      <div className="bg-white p-4 rounded-lg shadow space-y-3 mb-6">
        {metaLoading ? (
          <p className="text-gray-500">Loading modules and mentor info...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Module</label>
                <select
                  value={selectedModule}
                  onChange={(e) => handleModuleChange(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded"
                >
                  <option value="">-- Select module --</option>
                  {modules.map((m) => (
                    <option key={m.module_id ?? m.id} value={m.module_id ?? m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Mentor</label>
                <div className="mt-1 w-full p-2 border rounded bg-gray-50">
                  {selectedMentor ? (
                    <div>
                      <div className="font-medium">{selectedMentor.username ?? selectedMentor.username}</div>
                      <div className="text-xs text-gray-600">{selectedMentor.expertise ?? ""}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No mentor assigned for this module</div>
                  )}
                </div>
              </div>
            </div>

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
          </>
        )}
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
              className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                {editId === d.doubt_id ? (
                  <>
                    <textarea
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="mb-2">
                      <label className="block text-xs text-gray-600">Module</label>
                      <select
                        value={editModule}
                        onChange={(e) => setEditModule(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                      >
                        <option value="">-- Select module --</option>
                        {modules.map((m) => (
                          <option key={m.module_id ?? m.id} value={m.module_id ?? m.id}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(d.doubt_id)}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium">{d.question}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Module: {d.module_title ?? d.module_id ?? "—"} • Mentor: {d.mentor_name ?? d.mentor_id ?? "—"}
                    </p>
                    {d.answer && (
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        <strong className="text-sm">Answer:</strong>
                        <div>{d.answer}</div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{d.timestamp}</p>
                  </>
                )}
              </div>

              <div className="flex gap-2 items-start">
                <button
                  title="Edit"
                  onClick={() => startEdit(d)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  title="Delete"
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
