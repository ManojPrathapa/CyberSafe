"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
// import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function LoginPage() {
  // const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/student/home");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Header page="login" />
      <div className="max-w-md mx-auto mt-20 bg-white p-6 sm:p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">User Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-2 top-2 text-sm text-blue-600"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => signIn("google")}
            className="w-full border py-2 mt-2 rounded-md hover:bg-gray-100 transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
}
