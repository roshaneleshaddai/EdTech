"use client";
import { useAITeacher } from "@/hooks/useAITeacher";
import { useState, useEffect } from "react";

export const CourseInterface = () => {
  const {
    currentCourse,
    currentModule,
    courses,
    progress,
    mode,
    setMode,
    generateCourse,
    startModule,
    completeModule,
    loading
  } = useAITeacher();

  const [courseTopic, setCourseTopic] = useState("");
  const [showCourseGeneration, setShowCourseGeneration] = useState(false);

  const handleGenerateCourse = async () => {
    if (!courseTopic.trim()) return;
    
    try {
      await generateCourse(courseTopic);
      setShowCourseGeneration(false);
      setCourseTopic("");
    } catch (error) {
      console.error("Error generating course:", error);
    }
  };

  const getModuleProgress = (moduleId) => {
    return progress[moduleId]?.completed ? 100 : 0;
  };

  const getOverallProgress = () => {
    if (!currentCourse) return 0;
    const completedModules = currentCourse.modules.filter(
      module => progress[module.id]?.completed
    ).length;
    return Math.round((completedModules / currentCourse.modules.length) * 100);
  };

  if (mode === "course" && currentCourse) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 overflow-y-auto">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{currentCourse.title}</h1>
              <p className="text-xl text-gray-300 mb-4">{currentCourse.description}</p>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Duration: {currentCourse.estimatedDuration}</span>
                <span>Difficulty: {currentCourse.difficulty}</span>
                <span>Progress: {getOverallProgress()}%</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Course Modules</h2>
          {currentCourse.modules.map((module, index) => (
            <div
              key={module.id}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                progress[module.id]?.completed
                  ? "border-green-500 bg-green-500/10"
                  : currentModule?.id === module.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-800/50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-white">
                      {index + 1}.
                    </span>
                    <h3 className="text-xl font-bold text-white">{module.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      module.type === "lesson" 
                        ? "bg-blue-500/20 text-blue-300"
                        : module.type === "practice"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}>
                      {module.type}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{module.description}</p>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Duration: {module.duration}</span>
                    <span>Type: {module.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {progress[module.id]?.completed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => startModule(module.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {currentModule?.id === module.id ? "Continue" : "Start"}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Module Progress */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getModuleProgress(module.id)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Project */}
        {currentCourse.finalProject && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-3">Final Project</h3>
            <h4 className="text-xl font-semibold text-purple-300 mb-2">
              {currentCourse.finalProject.title}
            </h4>
            <p className="text-gray-300 mb-4">{currentCourse.finalProject.description}</p>
            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-white">Requirements:</h5>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {currentCourse.finalProject.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === "course" && !currentCourse) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">AI-Powered Learning</h1>
          <p className="text-xl text-gray-300 mb-8">
            Generate personalized courses on any topic and learn with our 3D AI professor
          </p>
          
          {!showCourseGeneration ? (
            <button
              onClick={() => setShowCourseGeneration(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Generate New Course
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter a topic (e.g., Web Development, Machine Learning, Photography)"
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleGenerateCourse()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateCourse}
                  disabled={loading || !courseTopic.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Generating..." : "Generate Course"}
                </button>
                <button
                  onClick={() => setShowCourseGeneration(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
