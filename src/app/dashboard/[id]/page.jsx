// src/app/dashboard/[courseId]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAITeacher } from "@/hooks/useAITeacher"; // Import your Zustand store

export default function ExploreCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id; // Access dynamic route param from folder name [id]

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Zustand actions for setting the AI Teacher state
  const { setMode, setCurrentModule, setCurrentAssessment } = useAITeacher();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const pastelColors = [
            "bg-blue-50/70",
            "bg-green-50/70",
            "bg-purple-50/70",
            "bg-yellow-50/70",
            "bg-pink-50/70",
            "bg-indigo-50/70",
            "bg-red-50/70",
            "bg-teal-50/70",
          ];
          const randomColorClass =
            pastelColors[Math.floor(Math.random() * pastelColors.length)];
          setCourse({
            ...data,
            colorClass: data.colorClass || randomColorClass,
          });
        } else {
          setError(data.message || "Failed to fetch course details.");
          console.error("Failed to fetch course details:", data.message);
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            router.push("/");
          }
        }
      } catch (err) {
        setError(
          "Network error or server unavailable when fetching course details."
        );
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, router]);

  // Handler for the "Explain" button on each module card
  const handleExplainModule = (moduleItem) => {
    setCurrentModule(moduleItem);
    setMode("module");
    setCurrentAssessment(null);
    router.push(`/dashboard/${courseId}/experience`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center justify-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">
            {error || `Course with ID "${courseId}" not found.`}
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  // Experience is now its own page at /dashboard/[id]/experience

  // Determine course progress (placeholder for now, needs actual user progress tracking)
  const totalModules = course.modules?.length || 0;
  const completedModules = 0; // This would come from user-specific progress data
  const progressPercentage =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 font-sans">
      <main className="max-w-5xl mx-auto space-y-10">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-lg font-semibold text-gray-700 hover:text-black transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
          Back to Courses
        </button>

        {/* Course Header Card (Liquid Glass) */}
        <div
          className={`${course.colorClass} backdrop-blur-xl border border-gray-200 p-8 rounded-3xl shadow-2xl`}
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
            {course.title}
          </h1>
          <p className="text-xl text-gray-700 font-medium mb-6">
            {course.description}
          </p>

          {/* Progress Bar (using mock data for completion) */}
          <div className="mt-8">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Progress: {progressPercentage}%
            </p>
            <div className="w-full bg-white/70 rounded-full h-3 shadow-inner">
              <div
                className={`h-3 rounded-full transition-all duration-500`}
                style={{
                  width: `${progressPercentage}%`,
                  background:
                    progressPercentage === 100 ? "#10b981" : "#3b82f6",
                }} // Tailwind colors: emerald-500 or blue-500
              ></div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <section className="mt-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Course Modules
          </h2>

          {course.modules && course.modules.length > 0 ? (
            <ul className="space-y-4">
              {course.modules.map((moduleItem) => (
                <li
                  key={moduleItem._id}
                  className={`p-6 rounded-2xl shadow-lg border border-gray-200
                              ${false // Placeholder for completion status styling
                      ? "bg-white/90 hover:shadow-xl"
                      : "bg-white/70 hover:bg-white/80"
                    }
                              backdrop-blur-md transition-all duration-200 cursor-pointer flex justify-between items-center`}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-4 p-3 rounded-full ${false // Placeholder for completion status icon styling
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {/* Icon based on completion status (placeholder) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        {false ? ( // Replace with actual moduleItem.isCompleted
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8.61l-9 9z" />
                        ) : (
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-semibold ${false ? "text-gray-900" : "text-gray-800"
                          }`}
                      >
                        {moduleItem.order}. {moduleItem.title}
                      </h3>
                      <p
                        className={`text-sm ${false
                          ? "text-emerald-600 font-medium"
                          : "text-gray-500"
                          }`}
                      >
                        Estimated Time: {moduleItem.duration}
                      </p>
                    </div>
                  </div>

                  <button
                    className={`px-4 py-2 font-medium rounded-lg transition duration-200 ${false // Placeholder for completion status to disable
                      ? "bg-gray-200 text-gray-700 cursor-default"
                      : "bg-black text-white hover:bg-gray-800"
                      }`}
                    disabled={false} // Replace with actual moduleItem.isCompleted
                    onClick={() => handleExplainModule(moduleItem)}
                  >
                    Explain {/* Changed from "Start" to "Explain" */}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-10 text-xl font-medium">
              No modules available for this course yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
