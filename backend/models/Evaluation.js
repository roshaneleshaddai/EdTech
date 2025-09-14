// backend/models/Evaluation.js
const mongoose = require("mongoose");

// Sub-schema to record user's answer for each question
const userAnswerSchema = mongoose.Schema(
  {
    questionId: {
      // Reference to the specific question within the quiz
      type: mongoose.Schema.Types.ObjectId, // Assuming Quiz.questions generate _id for each question
      required: true,
    },
    userAnswer: {
      // The answer provided by the user (text or selected option)
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    // --- AI-Specific Addition ---
    aiFeedback: {
      // AI-generated personalized feedback for this specific answer
      type: String,
    },
  },
  { _id: false }
);

const evaluationSchema = mongoose.Schema(
  {
    user: {
      // Reference to the user who took the quiz
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    quiz: {
      // Reference to the quiz document
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    course: {
      // Redundant but useful for quick lookup, reference to the parent course
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    module: {
      // Redundant but useful for quick lookup, the module ID
      type: String, // The `id` field of the embedded module
      required: true,
    },
    userAnswers: [userAnswerSchema], // Array of user's answers and their correctness
    score: {
      // Total score achieved
      type: Number,
      required: true,
    },
    percentageScore: {
      // Percentage score for easy comparison
      type: Number,
      required: true,
    },
    passed: {
      // Whether the user passed the quiz
      type: Boolean,
      default: false,
    },
    // --- AI-Specific Addition ---
    overallAiFeedback: {
      // Overall AI-generated feedback for the entire quiz attempt
      type: String,
    },
  },
  {
    timestamps: true, // `createdAt` (attempt time) and `updatedAt`
  }
);

const Evaluation = mongoose.model(
  "Evaluation",
  evaluationSchema,
  "evaluations"
);
module.exports = Evaluation;
