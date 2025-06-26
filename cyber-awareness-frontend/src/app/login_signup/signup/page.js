"use client";

import { useState } from "react";
// import Link from "next/link";
import Header from "@/components/Header";

export default function SignupPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Add signup API logic here
    setMessage("Signup successful!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50">
      <Header page="signup" />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-10">
        <h2 className="text-center text-2xl font-extrabold mb-4 text-gray-800">CREATE YOUR ACCOUNT</h2>

        {message && <div className="text-green-600 text-center mb-4">{message}</div>}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-bold text-gray-700">USER ID</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">PASSWORD</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">ROLE</label>
            <select
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
              <option value="Trainer">Trainer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">AGE</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={age}
              onChange={(e) => setAge(e.target.value)}
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
  );
}
