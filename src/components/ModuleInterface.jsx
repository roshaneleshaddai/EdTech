"use client";
import { useAITeacher } from "@/hooks/useAITeacher";
import { useState, useEffect } from "react";

export const ModuleInterface = () => {
  const {
    currentModule,
    currentCourse,
    mode,
    setMode,
    completeModule,
    generateAssessment,
    loading
  } = useAITeacher();

  const [currentStep, setCurrentStep] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [doubtQuestion, setDoubtQuestion] = useState("");
  const [doubtAnswer, setDoubtAnswer] = useState(null);

  const steps = [
    "overview",
    "video",
    "concepts",
    "practice",
    "assessment"
  ];

  const handleCompleteModule = () => {
    completeModule(currentModule.id);
    setMode("course");
  };

  const handleGenerateAssessment = async () => {
    try {
      await generateAssessment(currentModule.id);
      setShowAssessment(true);
    } catch (error) {
      console.error("Error generating assessment:", error);
    }
  };

  const handleAskDoubt = async () => {
    if (!doubtQuestion.trim()) return;
    
    try {
      const context = JSON.stringify({
        course: currentCourse?.title,
        module: currentModule?.title,
        concepts: currentModule?.content?.keyConcepts
      });
      
      const res = await fetch(
        `/api/ai?question=${encodeURIComponent(doubtQuestion)}&context=${encodeURIComponent(context)}`
      );
      const answer = await res.json();
      setDoubtAnswer(answer);
    } catch (error) {
      console.error("Error asking doubt:", error);
    }
  };

  if (!currentModule) return null;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 overflow-y-auto">
      {/* Module Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentModule.title}</h1>
            <p className="text-lg text-gray-300 mb-4">{currentModule.description}</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Duration: {currentModule.duration}</span>
              <span>Type: {currentModule.type}</span>
              <span>Course: {currentCourse?.title}</span>
            </div>
          </div>
          <button
            onClick={() => setMode("course")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Course
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex space-x-2 mb-6">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-green-500"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Overview Step */}
        {currentStep === 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Module Overview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Learning Objectives</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {currentModule.learningObjectives?.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {currentModule.content?.keyConcepts?.map((concept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Step */}
        {currentStep === 1 && (
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Video Lesson</h2>
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-xl text-gray-300 mb-4">
                The 3D AI Professor will deliver this lesson
              </p>
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <h4 className="text-lg font-semibold text-white mb-2">Lesson Script:</h4>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {currentModule.content?.videoScript}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Concepts Step */}
        {currentStep === 2 && (
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Key Concepts</h2>
            <div className="space-y-4">
              {currentModule.content?.keyConcepts?.map((concept, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{concept}</h3>
                  <p className="text-gray-300">
                    Detailed explanation of {concept.toLowerCase()} will be provided here.
                  </p>
                </div>
              ))}
              
              <div className="bg-blue-900/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Practical Examples</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {currentModule.content?.practicalExamples?.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Practice Step */}
        {currentStep === 3 && (
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Hands-on Practice</h2>
            <div className="bg-green-900/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Practice Activity</h3>
              <p className="text-gray-300 mb-4">
                {currentModule.content?.handsOnActivity}
              </p>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-md font-semibold text-white mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                  <li>Follow the activity description above</li>
                  <li>Apply the concepts you've learned</li>
                  <li>Test your understanding through practice</li>
                  <li>Ask questions if you need clarification</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Step */}
        {currentStep === 4 && (
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Assessment</h2>
            {!showAssessment ? (
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-300 mb-6">
                  Ready to test your knowledge? Generate a practical assessment.
                </p>
                <button
                  onClick={handleGenerateAssessment}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? "Generating..." : "Generate Assessment"}
                </button>
              </div>
            ) : (
              <div className="bg-purple-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Assessment Generated Successfully!
                </h3>
                <p className="text-gray-300 mb-4">
                  Your practical assessment is ready. Complete it to finish this module.
                </p>
                <button
                  onClick={() => setMode("assessment")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Take Assessment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Doubt Resolution */}
      <div className="mt-8 bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Ask a Question</h3>
        <div className="space-y-4">
          <textarea
            placeholder="Ask any question about this module..."
            value={doubtQuestion}
            onChange={(e) => setDoubtQuestion(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            rows={3}
          />
          <button
            onClick={handleAskDoubt}
            disabled={loading || !doubtQuestion.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Ask Question
          </button>
        </div>
        
        {doubtAnswer && (
          <div className="mt-4 bg-blue-900/30 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">AI Professor's Answer:</h4>
            <p className="text-gray-300 mb-3">{doubtAnswer.answer}</p>
            {doubtAnswer.examples && doubtAnswer.examples.length > 0 && (
              <div className="mb-3">
                <h5 className="text-md font-semibold text-white mb-1">Examples:</h5>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {doubtAnswer.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-green-300 font-medium">{doubtAnswer.encouragement}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="flex gap-3">
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCompleteModule}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Module
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
