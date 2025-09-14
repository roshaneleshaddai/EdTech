// backend/models/Quiz.js
const mongoose = require("mongoose");

// Sub-schema for individual quiz questions
const questionSchema = mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    type: {
      // e.g., 'mcq', 'fill_in_blank', 'true_false', 'short_answer'
      type: String,
      enum: ["mcq", "fill_in_blank", "true_false", "short_answer"],
      default: "mcq",
    },
    options: [
      {
        // For MCQ, true/false. Not used for fill_in_blank.
        type: String,
      },
    ],
    correctAnswer: {
      // The correct option text or fill-in-blank answer
      type: String,
      required: true,
    },
    explanation: {
      // Why this is the correct answer
      type: String,
    },
    // --- AI-Specific Additions ---
    aiGenerationDetails: {
      modelUsed: String,
      promptUsed: String,
      timestamp: { type: Date, default: Date.now },
    },
  },
  { _id: false }
);

const quizSchema = mongoose.Schema(
  {
    course: {
      // Reference to the parent course
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    // If modules are embedded, we use their string `id`
    // If modules were a separate collection, this would be `mongoose.Schema.Types.ObjectId`
    module: {
      type: String, // The `id` field of the embedded module
      required: true,
      // No `ref` because it's an embedded document's ID, not a separate collection.
    },
    title: {
      // Title of the quiz, e.g., "Module 1 Assessment"
      type: String,
      required: true,
    },
    questions: [questionSchema], // Array of embedded question objects
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    passScorePercentage: {
      type: Number,
      default: 70, // E.g., user needs 70% to pass
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema, "quizzes");
module.exports = Quiz;
