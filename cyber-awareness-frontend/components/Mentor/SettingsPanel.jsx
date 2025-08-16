"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Lock,
  EyeOff,
  Send,
  Shield,
  Trash2,
  Edit3,
  Save,
} from "lucide-react";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";
import { getUser, getToken } from "@/src/app/utils/auth";

export default function SettingsPanel() {
  const [complaints, setComplaints] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState(null);

  // password update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const token = getToken();
  const user = getUser();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();

      setComplaints(
        data.filter(
          (c) =>
            String(c.filed_by) === String(user.id) && String(c.isDeleted) == "0"
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      fetchComplaints();
    }
  }, []);

  const handleFileComplaint = async () => {
    if (!complaint.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filed_by: user.id,
          against: 4, // Assuming 4 is the ID for admin
          // Adjust this based on your backend logic
          description: complaint.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to file complaint");
      setComplaint("");
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete complaint");
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/api/complaints/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetch(`${API_BASE_URL}/api/complaints/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filed_by: user.id,
          against: 4,
          description: editText.trim(),
        }),
      });
      setEditId(null);
      setEditText("");
      fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/update-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");
      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordMessage(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-gray-800">
      <h3 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
        <Shield size={28} /> Settings
      </h3>

      {/* Password Update */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3 mb-6">
        <h4 className="flex items-center gap-2 font-semibold text-purple-700">
          <Lock className="text-indigo-600" /> Update Password
        </h4>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handlePasswordUpdate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          Reset Password
        </button>
        {passwordMessage && (
          <p
            className={`text-sm ${
              passwordMessage.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {passwordMessage}
          </p>
        )}
      </div>

      {/* Complaints Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-semibold text-purple-700">
            My Complaints
          </h4>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <Send size={18} /> {showForm ? "Cancel" : "Raise Complaint"}
          </button>
        </div>

        {showForm && (
          <div className="mt-4">
            <textarea
              placeholder="Describe your issue or complaint..."
              rows={4}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            ></textarea>
            <button
              onClick={handleFileComplaint}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
            >
              Submit Complaint
            </button>
          </div>
        )}

        {loading ? (
          <p className="mt-4 text-gray-500">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="mt-4 text-gray-500">No complaints found.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {complaints.map((c) => (
              <li
                key={c.complaint_id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                {editId === c.complaint_id ? (
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={() => handleEdit(c.complaint_id)}
                      className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Save size={14} /> Save
                    </button>
                  </div>
                ) : (
                  <p className="flex-1">{c.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(c.complaint_id);
                      setEditText(c.description);
                    }}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.complaint_id)}
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
    </div>
  );
}
