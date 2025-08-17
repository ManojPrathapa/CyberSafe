"use client";

import { useEffect, useState } from "react";
import {
  apiHelpers,
  getUserId,
  getAuthToken,
} from "../../src/app/utils/apiConfig";

export default function NotificationPreferences() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'success'|'error', text:string}

  // Preferences state
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true); // in-app
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [frequency, setFrequency] = useState("immediate"); // immediate | daily | weekly

  const userId = getUserId();

  // ---- auth check
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !userId) {
      setAuthenticated(false);
      setAuthChecked(true);
      setLoading(false);
      setMsg({ type: "error", text: "Authentication required. Please login." });
    } else {
      setAuthenticated(true);
      setAuthChecked(true);
    }
  }, [userId]);

  // ---- load existing preferences
  useEffect(() => {
    if (!authenticated || !userId) return;

    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const data = await apiHelpers.get(`/api/notifications/prefs/${userId}`);
        // Defaults if backend returns none
        setEmailEnabled(Boolean(data?.email_enabled ?? true));
        setPushEnabled(Boolean(data?.push_enabled ?? true));
        setSmsEnabled(Boolean(data?.sms_enabled ?? false));
        setFrequency(data?.frequency ?? "immediate");
      } catch (err) {
        setMsg({
          type: "error",
          text: err?.message || "Failed to load preferences.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [authenticated, userId]);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await apiHelpers.post(`/notifications/prefs`, {
        user_id: userId,
        email_enabled: emailEnabled,
        push_enabled: pushEnabled,
        sms_enabled: smsEnabled,
        frequency,
      });
      setMsg({ type: "success", text: "Preferences saved." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.message || "Failed to save preferences.",
      });
    } finally {
      setSaving(false);
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
        <p>Please login to manage notification preferences.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-purple-900">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        📩 Notification Preferences
      </h2>

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

      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow max-w-2xl space-y-6">
        {loading ? (
          <div className="animate-pulse text-sm text-gray-500">Loading…</div>
        ) : (
          <>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-gray-800">Show in-app notifications</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-gray-800">Send email notifications</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-gray-800">Send SMS notifications</span>
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Delivery frequency
              </p>
              <div className="flex gap-4">
                {["immediate", "daily", "weekly"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="freq"
                      value={opt}
                      checked={frequency === opt}
                      onChange={() => setFrequency(opt)}
                    />
                    <span className="capitalize">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Preferences"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
