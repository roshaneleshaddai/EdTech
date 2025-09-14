// src/app/dashboard/page.js
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CourseDashboardPage() {
  const [courses, setCourses] = useState([]); // Initialize as empty, will fetch from backend
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState(null); // To display user's name
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState("");

  const router = useRouter();

  // This useEffect will run AFTER the DashboardLayout has authenticated
  useEffect(() => {
    const fetchUserProfileAndCourses = async () => {
      const token = localStorage.getItem("token");
      // Token check already done by layout, but defensive coding never hurts
      if (!token) {
        router.push("/");
        return;
      }

      // Fetch user profile (can be optimized if layout provides context)
      try {
        const profileResponse = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileData = await profileResponse.json();
        if (profileResponse.ok) {
          setUserProfile(profileData);
        } else {
          console.error("Failed to fetch user profile:", profileData.message);
          // If profile fetch fails here, something is wrong, redirect to login
          localStorage.removeItem("token");
          router.push("/");
          return;
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      // Fetch ALL courses from backend
      try {
        setLoadingCourses(true);
        const coursesResponse = await fetch(
          "http://localhost:5000/api/courses",
          {
            headers: { Authorization: `Bearer ${token}` }, // Send token for protected endpoint
          }
        );
        const coursesData = await coursesResponse.json();
        if (coursesResponse.ok) {
          // Assign random frontend color classes to backend courses
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
          const coursesWithColors = coursesData.map((course) => ({
            ...course,
            colorClass:
              pastelColors[Math.floor(Math.random() * pastelColors.length)],
          }));
          setCourses(coursesWithColors);
        } else {
          setCoursesError(coursesData.message || "Failed to fetch courses");
          console.error("Failed to fetch courses:", coursesData.message);
        }
      } catch (err) {
        setCoursesError(
          "Network error or server unavailable when fetching courses."
        );
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchUserProfileAndCourses();
  }, [router]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (newCourseTitle.trim() === "" || newCourseDescription.trim() === "") {
      alert("Please fill in both the course title and description.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      router.push("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token
        },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDescription,
          // You can add category and level fields to the modal form and send them here
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Assign a random pastel color class for the new course for frontend display
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

        setCourses((prevCourses) => [
          ...prevCourses,
          { ...data, colorClass: randomColorClass },
        ]);
        setNewCourseTitle("");
        setNewCourseDescription("");
        setShowAddCourseModal(false);
      } else {
        alert(`Failed to add course: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("An error occurred while adding the course.");
    }
  };

  const handleExplore = (courseId) => {
    router.push(`/dashboard/${courseId}`); // Navigate to nested explore page
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    router.push("/"); // Redirect to the login page
  };

  const filteredCourses = useMemo(() => {
    if (!searchTerm) {
      return courses;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowercasedSearchTerm) ||
        course.description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [courses, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 font-sans relative">
      <header className="text-center mb-16 pt-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Course Canvas
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">
          Welcome, {userProfile?.username || "Explorer"}! Craft, discover, and
          explore knowledge pathways with refined elegance.
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-10 relative">
        {/* Add Course Button - Fixed to Top-Right of Main Content Area */}
        <button
          onClick={() => setShowAddCourseModal(true)}
          className="fixed top-8 right-8 z-40 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-xl
                     hover:bg-gray-800 transition-all duration-200 ease-in-out
                     hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 transform-gpu"
          aria-label="Add new course"
        >
          {/* Material Icon: Add */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>

        {/* Existing Courses Section */}
        <section className="bg-white/70 backdrop-blur-xl border border-gray-200 p-8 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Existing Courses
          </h2>

          {/* Search Bar */}
          <div className="mb-8">
            <label htmlFor="courseSearch" className="sr-only">
              Search Courses
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Material Icon: Search */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
              <input
                type="text"
                id="courseSearch"
                className="w-full pl-10 pr-5 py-3 bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl
                           text-gray-800 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm
                           transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loadingCourses ? (
            <p className="text-gray-600 text-center py-10 text-xl font-medium">
              Loading courses...
            </p>
          ) : coursesError ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative my-6"
              role="alert"
            >
              <span className="block sm:inline">{coursesError}</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <p className="text-gray-600 text-center py-10 text-xl font-medium">
              No courses found. Try a different search or add a new one!
            </p>
          ) : (
            <ul className="space-y-6">
              {filteredCourses.map((course) => (
                <li
                  key={course._id} // Use course._id from backend for key
                  className={`${course.colorClass} backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200
                             hover:shadow-lg transition-all duration-200 ease-in-out transform-gpu cursor-pointer`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <button
                    onClick={() => handleExplore(course._id)} // Use course._id for navigation
                    className="mt-3 px-6 py-2 bg-black text-white font-semibold rounded-lg
                               hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400
                               focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 shadow-sm"
                  >
                    Explore Course
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Add New Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative bg-white/80 backdrop-blur-3xl border border-gray-300 p-8 rounded-3xl shadow-2xl max-w-lg w-full m-auto animate-scale-in">
            <button
              onClick={() => setShowAddCourseModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full
                         bg-white/50 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </button>

            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Create New Course
            </h2>
            <form onSubmit={handleAddCourse} className="space-y-6">
              <div>
                <label
                  htmlFor="modalCourseTitle"
                  className="block text-lg font-medium text-gray-800 mb-2"
                >
                  Course Title
                </label>
                <input
                  type="text"
                  id="modalCourseTitle"
                  className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all duration-200 focus:bg-white focus:outline-none text-lg"
                  placeholder="e.g., Advanced React Patterns"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="modalCourseDescription"
                  className="block text-lg font-medium text-gray-800 mb-2"
                >
                  Course Description
                </label>
                <textarea
                  id="modalCourseDescription"
                  rows="5"
                  className="block w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all duration-200 focus:bg-white focus:outline-none text-lg resize-y"
                  placeholder="Provide a detailed overview of the course content and learning outcomes..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg text-xl font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 ease-in-out"
              >
                Create Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
