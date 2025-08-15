"use client";

import { useEffect, useMemo, useState } from "react";
import {
  apiHelpers,
  getAuthToken,
  getStoredUser,
  handleApiError,
} from "../../src/app/utils/apiConfig";

export default function ManageChildren() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [linked, setLinked] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // current parent from localStorage "user"
  const parentUser = getStoredUser() || {};
  const parentId = parentUser?.id || parentUser?.user_id || 0;

  // ------------------ Auth check ------------------
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setAuthenticated(false);
      setAuthChecked(true);
      setLoading(false);
      setMessage({
        type: "error",
        text: "Authentication required. Please login.",
      });
    } else {
      setAuthenticated(true);
      setAuthChecked(true);
    }
  }, []);

  // ------------------ Load data ------------------
  const loadAll = async () => {
    setLoading(true);
    try {
      // 1) Fetch all users, filter to students for the picker
      const users = await apiHelpers.get("/admin/users");
      const onlyStudents = Array.isArray(users)
        ? users.filter((u) => u.role === "student")
        : [];
      setStudents(onlyStudents);

      // 2) Fetch linked children for this parent (backend)
      const children = await apiHelpers.get(`/parents/${parentId}/children`);
      setLinked(Array.isArray(children) ? children : []);
    } catch (err) {
      handleApiError(err);
      setMessage({
        type: "error",
        text: "Failed to load children/users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !parentId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, parentId]);

  // ------------------ Derived ------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.username?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
    );
  }, [students, query]);

  const isLinked = (id) => linked.some((c) => c.id === id);

  // ------------------ Link / Unlink via API ------------------
  const linkChild = async (studentId) => {
    try {
      setBusyId(studentId);
      await apiHelpers.post("/parents/link", {
        parent_id: parentId,
        student_id: studentId,
      });
      await loadAll();
      setMessage({ type: "success", text: "Child linked successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to link child.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const unlinkChild = async (studentId) => {
    try {
      setBusyId(studentId);
      await apiHelpers.post("/parents/unlink", {
        parent_id: parentId,
        student_id: studentId,
      });
      await loadAll();
      setMessage({ type: "success", text: "Child unlinked." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to unlink child.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const linkByLookup = async () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setMessage({ type: "error", text: "Type a username or email to add." });
      return;
    }
    const found = students.find(
      (s) => s.username?.toLowerCase() === q || s.email?.toLowerCase() === q
    );
    if (!found) {
      setMessage({
        type: "error",
        text: "No student found with that username/email.",
      });
      return;
    }
    await linkChild(found.id);
  };

  // ------------------ UI ------------------

  if (!authChecked) {
    return (
      <div className="p-6 text-purple-700">
        <div className="animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="p-6 text-red-700">
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p>Please login to manage linked children.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-purple-900">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        👨‍👩‍👧 Manage Linked Children
      </h2>

      {message && (
        <div
          className={`mb-4 rounded border px-3 py-2 text-sm ${
            message.type === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Linked children list */}
      <div className="bg-white border border-purple-200 rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          Currently Linked
        </h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : linked.length === 0 ? (
          <p className="text-sm text-gray-500">
            No children linked yet. Link one below.
          </p>
        ) : (
          <ul className="space-y-2">
            {linked.map((child) => (
              <li
                key={child.id}
                className="flex items-center justify-between bg-purple-50 rounded px-3 py-2"
              >
                <div className="text-sm">
                  <span className="font-semibold">{child.username}</span>
                  {child.email ? (
                    <span className="text-gray-600"> — {child.email}</span>
                  ) : null}
                </div>
                <button
                  onClick={() => unlinkChild(child.id)}
                  disabled={busyId === child.id}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {busyId === child.id ? "Unlinking…" : "Unlink"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search + quick add */}
      <div className="bg-white border border-purple-200 rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          Link a Child
        </h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or email…"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={linkByLookup}
            className="whitespace-nowrap bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add by match
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          Tip: Type an exact username or email and click “Add by match”, or pick
          from the list below.
        </p>

        <div className="max-h-64 overflow-auto border border-gray-200 rounded">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Loading students…</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No matches.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2">Username</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2">{s.username}</td>
                    <td className="px-3 py-2">{s.email}</td>
                    <td className="px-3 py-2">
                      {isLinked(s.id) ? (
                        <button
                          onClick={() => unlinkChild(s.id)}
                          disabled={busyId === s.id}
                          className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                          {busyId === s.id ? "Unlinking…" : "Unlink"}
                        </button>
                      ) : (
                        <button
                          onClick={() => linkChild(s.id)}
                          disabled={busyId === s.id}
                          className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                          {busyId === s.id ? "Linking…" : "Link"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
