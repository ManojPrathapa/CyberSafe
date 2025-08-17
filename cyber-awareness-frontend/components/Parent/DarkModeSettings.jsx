"use client";

import { useEffect, useRef, useState } from "react";
import {
  apiHelpers,
  getUserId,
  getAuthToken,
} from "../../src/app/utils/apiConfig";

function applyThemeClass(theme) {
  // Tailwind "dark mode: class" strategy
  const el = document.documentElement;
  if (theme === "dark") {
    el.classList.add("dark");
  } else if (theme === "light") {
    el.classList.remove("dark");
  } else {
    // system: follow OS
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    el.classList.toggle("dark", !!prefersDark);
  }
}

export default function DarkModeSettings() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'success'|'error', text:string}

  // "light" | "dark" | "system"
  const [theme, setTheme] = useState("system");

  const userId = getUserId();
  const sysListenerAttached = useRef(false);

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

  // ---- local init (instant UI) then server fetch to override
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") || "system";
      setTheme(saved);
      applyThemeClass(saved);

      // attach system change listener once (for "system" option)
      if (!sysListenerAttached.current) {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
          const t = localStorage.getItem("theme") || "system";
          if (t === "system") applyThemeClass("system");
        };
        try {
          mql.addEventListener("change", onChange);
        } catch {
          // Safari
          mql.addListener(onChange);
        }
        sysListenerAttached.current = true;
      }
    }
  }, []);

  // ---- fetch server preference
  useEffect(() => {
    if (!authenticated || !userId) return;

    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const data = await apiHelpers.get(`/api/prefs/theme/${userId}`);
        if (data?.theme) {
          setTheme(data.theme);
          if (typeof window !== "undefined") {
            localStorage.setItem("theme", data.theme);
          }
          applyThemeClass(data.theme);
        }
      } catch (err) {
        // not fatal; stay with local preference
        setMsg({
          type: "error",
          text: err?.message || "Failed to load theme preference (using local).",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [authenticated, userId]);

  const handleChoose = (value) => {
    setTheme(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", value);
    }
    applyThemeClass(value);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await apiHelpers.post("/prefs/theme", {
        user_id: userId,
        theme,
      });
      setMsg({ type: "success", text: "Theme preference saved." });
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.message || "Failed to save theme preference.",
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
        <p>Please login to manage dark mode.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-purple-900">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">🌙 Dark Mode Settings</h2>

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

      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow max-w-xl space-y-6">
        {loading ? (
          <div className="animate-pulse text-sm text-gray-500">Loading…</div>
        ) : (
          <>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Choose your appearance
              </p>
              <div className="flex gap-5">
                {["system", "light", "dark"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="theme"
                      value={opt}
                      checked={theme === opt}
                      onChange={() => handleChoose(opt)}
                    />
                    <span className="capitalize">{opt}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                “System” follows your OS theme automatically.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Preference"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
