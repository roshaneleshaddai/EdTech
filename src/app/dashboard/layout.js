// src/app/dashboard/layout.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // No token found, user is not authenticated
        setIsAuthenticated(false);
        setLoading(false);
        router.push("/"); // Redirect to login
        return;
      }

      // Token exists, now validate it with the backend
      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token for validation
          },
        });

        if (response.ok) {
          // Token is valid and profile fetched successfully
          setIsAuthenticated(true);
        } else {
          // Token invalid, expired, or backend authentication failed
          localStorage.removeItem("token"); // Clear the bad token
          setIsAuthenticated(false);
          router.push("/"); // Redirect to login
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token"); // Network error or server issues, assume token is not valid
        setIsAuthenticated(false);
        router.push("/"); // Redirect to login
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]); // Dependency array to re-run effect if router object changes

  // Render a loading spinner or message while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">Authenticating...</p>
      </div>
    );
  }

  // If not authenticated after loading, it means router.push('/') has been called.
  // This return is a safeguard, but typically the redirection prevents rendering this.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Access Denied. Please log in.</p>
      </div>
    );
  }

  // If authenticated, render the child components (the actual dashboard pages)
  return <>{children}</>;
}
