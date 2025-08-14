"use client";

import { useState, useEffect } from "react";
import {
  apiHelpers,
  getUserId,
  getAuthToken,
} from "../../src/app/utils/apiConfig"; // adjust if your path differs

export default function ChangePassword() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error', text: string }

  const userId = getUserId();

  // ---- auth check
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !userId) {
      setAuthenticated(false);
      setAuthChecked(true);
      setMsg({ type: "error", text: "Authentication required. Please login." });
    } else {
      setAuthenticated(true);
      setAuthChecked(true);
    }
  }, [userId]);

  // ---- validation
  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return "All fields are required.";
    }
    if (newPassword.length < 8) {
      return "New password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match.";
    }
    if (newPassword === oldPassword) {
      return "New password must be different from old password.";
    }
    // (Optional) add more rules: at least 1 number/symbol/uppercase, etc.
    return null;
  };

  // ---- submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }

    setSubmitting(true);
    try {
      await apiHelpers.post("/profile/change-password", {
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMsg({ type: "success", text: "Password updated successfully." });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMsg({
        type: "error",
        text: error?.message || "Failed to update password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="p-6 text-purple-700">
        <div className="animate-pulse">Checking authentication…</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="p-6 text-red-700">
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p>Please login to change your password.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-purple-900">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">🔒 Change Password</h2>

      {msg && (
        <div
          className={`mb-4 rounded border px-3 py-2 text-sm ${
            msg.type === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-purple-200 rounded-lg p-6 shadow space-y-4 max-w-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Use a mix of letters, numbers, and symbols.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
