"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { API_BASE_URL } from "@/src/app/utils/apiConfig"; 
import { saveAuth } from "@/src/app/utils/auth";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user info
        saveAuth(data.access_token, data.user);


        
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful! Redirecting...");

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "student") {
            window.location.href = "/Students";
          } else if (data.user.role === "parent") {
            window.location.href = "/Parents";
          } else if (data.user.role === "admin") {
            window.location.href = "/Admin/home";
          }
          else if (data.user.role === "mentor") {
            window.location.href = "/mentor";
          }
          else if (data.user.role === "support") {
            window.location.href = "/support";
          } 
          else {
            window.location.href = "/login_signup/login";
          }
        }, 1000);
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <>
      <Header page="login" />
      <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">User Login</h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm text-center">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-black">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
