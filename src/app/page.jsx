// src/app/page.js
"use client"; // This component uses client-side hooks like useState and useRouter

import React, { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State for displaying error messages

  const router = useRouter();

  // Effect to check if user is already authenticated and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If a token exists, immediately redirect to dashboard.
      // The dashboard layout will handle full token validation.
      router.push("/dashboard");
    }
  }, [router]);

  // Helper function to handle API calls
  const makeAuthRequest = async (url, method, body) => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Authentication error:", err);
      throw err; // Re-throw to be caught by the form submission handlers
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await makeAuthRequest(
        "http://localhost:5000/api/auth/login",
        "POST",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      // Login successful: Store token and redirect
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Redirect to the protected dashboard

      // Clear form
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      // Error handled by makeAuthRequest and displayed via 'error' state
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const data = await makeAuthRequest(
        "http://localhost:5000/api/auth/register",
        "POST",
        {
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          // role: 'student' // You can add a role selection in the UI if needed
        }
      );

      // Signup successful: Store token and redirect
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Redirect to the protected dashboard

      // Clear form
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    } catch (err) {
      // Error handled by makeAuthRequest and displayed via 'error' state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6 sm:p-10 font-sans">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-3xl border border-gray-200 p-8 rounded-3xl shadow-2xl space-y-8 animate-scale-in">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Welcome
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Join or sign in to manage your courses.
        </p>

        {/* Error Message Display */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Pill-designed Tabs */}
        <div className="flex bg-gray-100/50 backdrop-blur-sm border border-gray-200 rounded-full p-1 shadow-sm">
          <button
            className={`flex-1 py-3 text-lg font-semibold rounded-full transition-all duration-200 ${
              activeTab === "login"
                ? "bg-black text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200/50"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold rounded-full transition-all duration-200 ${
              activeTab === "signup"
                ? "bg-black text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200/50"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" ? (
          // Login Form
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="loginEmail"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="loginEmail"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="loginPassword"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg
                         text-xl font-bold text-white bg-black hover:bg-gray-800
                         focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        ) : (
          // Signup Form
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="signupUsername"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="signupUsername"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="Your username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="signupEmail"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="signupEmail"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="signupPassword"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="signupPassword"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="signupConfirmPassword"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="signupConfirmPassword"
                className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl
                           text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="••••••••"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg
                         text-xl font-bold text-white bg-black hover:bg-gray-800
                         focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 ease-in-out"
            >
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
