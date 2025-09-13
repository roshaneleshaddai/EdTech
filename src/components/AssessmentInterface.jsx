"use client";
import { useAITeacher } from "@/hooks/useAITeacher";
import { useState, useEffect } from "react";

export const AssessmentInterface = () => {
  const {
    currentAssessment,
    assessments,
    mode,
    setMode,
    submitAssessment,
    loading
  } = useAITeacher();

  const [submission, setSubmission] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    // Get the latest assessment if none is currently selected
    if (!currentAssessment && assessments.length > 0) {
      const latestAssessment = assessments[assessments.length - 1];
      setMode("assessment");
    }
  }, [assessments, currentAssessment, setMode]);

  const handleSubmitAssessment = async () => {
    if (!submission.trim() || !currentAssessment) return;
    
    try {
      const result = await submitAssessment(currentAssessment.id, {
        submission,
        submittedAt: new Date().toISOString()
      });
      setEvaluation(result);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  if (!currentAssessment) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">No Assessment Available</h1>
          <p className="text-xl text-gray-300 mb-8">
            Complete a module to generate an assessment
          </p>
          <button
            onClick={() => setMode("course")}
            className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 overflow-y-auto">
        {/* Evaluation Results */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {evaluation.overallScore >= 90 ? "🎉" : evaluation.overallScore >= 70 ? "👏" : "📚"}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Assessment Complete!</h1>
          <div className="text-6xl font-bold text-white mb-2">
            {evaluation.overallScore}/{evaluation.maxScore}
          </div>
          <div className="text-3xl font-bold text-blue-300 mb-4">
            Grade: {evaluation.grade}
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Overall Feedback</h2>
          <p className="text-lg text-gray-300 mb-4">{evaluation.feedback.summary}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">Strengths</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {evaluation.feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Areas for Improvement</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {evaluation.feedback.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Evaluation */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Detailed Evaluation</h2>
          <div className="space-y-4">
            {evaluation.detailedEvaluation.map((item, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.criterion}</h3>
                  <span className="text-xl font-bold text-blue-300">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{item.feedback}</p>
                {item.suggestions && item.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-yellow-300 mb-1">Suggestions:</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {item.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {evaluation.recommendations && evaluation.recommendations.length > 0 && (
          <div className="bg-blue-900/30 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recommended Resources</h2>
            <div className="space-y-3">
              {evaluation.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-300 mb-1">{rec.title}</h3>
                  <p className="text-gray-300 mb-2">{rec.reason}</p>
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {rec.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div className="bg-green-900/30 rounded-xl p-6 mb-6">
          <p className="text-xl text-green-300 font-medium text-center">
            {evaluation.encouragement}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Next Steps</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {evaluation.feedback.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("course")}
            className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Continue Learning
          </button>
          <button
            onClick={() => {
              setEvaluation(null);
              setSubmission("");
            }}
            className="px-8 py-4 bg-gray-600 text-white text-xl font-bold rounded-xl hover:bg-gray-700 transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl p-8 overflow-y-auto">
      {/* Assessment Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentAssessment.title}</h1>
            <p className="text-lg text-gray-300 mb-4">{currentAssessment.description}</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Type: {currentAssessment.type}</span>
              <span>Difficulty: {currentAssessment.difficulty}</span>
              <span>Time: {currentAssessment.estimatedTime}</span>
            </div>
          </div>
          <button
            onClick={() => setMode("course")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Instructions</h2>
        <p className="text-lg text-gray-300 whitespace-pre-wrap">
          {currentAssessment.instructions}
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
        <div className="space-y-3">
          {currentAssessment.requirements.map((req, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700/50 rounded-lg p-4">
              <div className="flex-1">
                <p className="text-gray-300">{req.description}</p>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  req.type === "mandatory" 
                    ? "bg-red-500/20 text-red-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {req.type}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-300">
                {req.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      {currentAssessment.hints && currentAssessment.hints.length > 0 && (
        <div className="bg-yellow-900/30 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Hints</h2>
            <button
              onClick={() => setShowHints(!showHints)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {showHints ? "Hide" : "Show"} Hints
            </button>
          </div>
          {showHints && (
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {currentAssessment.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Resources */}
      {currentAssessment.resources && currentAssessment.resources.length > 0 && (
        <div className="bg-green-900/30 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Resources</h2>
          <div className="space-y-3">
            {currentAssessment.resources.map((resource, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-300 mb-1">{resource.title}</h3>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {resource.url}
                </a>
                <span className="ml-2 text-sm text-gray-400">({resource.type})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Area */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Submission</h2>
        <textarea
          placeholder="Enter your solution, code, or response here..."
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          rows={10}
        />
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {submission.length} characters
          </span>
          <button
            onClick={handleSubmitAssessment}
            disabled={loading || !submission.trim()}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};
