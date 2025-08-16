"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { API_BASE_URL } from "@/src/app/utils/apiConfig";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Added username
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState(""); // Changed age -> dob
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || email.split("@")[0], // Auto-generate username if not asked
          email: email,
          password: password,
          role: role.toLowerCase(), // Backend expects lowercase roles like "student"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful!");
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <>
      <Header page="signup" />
      <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-10">
          <h2 className="text-center text-2xl font-extrabold mb-4 text-black">
            CREATE ACCOUNT
          </h2>

          {message && (
            <div className="text-green-600 text-center mb-4">{message}</div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-bold text-black">Email ID</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black">Username</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black">PASSWORD</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">ROLE</label>
              <select
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">DOB</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-2 rounded shadow"
            >
              SIGNUP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
