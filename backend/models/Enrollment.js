// backend/models/Enrollment.js
const mongoose = require("mongoose");

// Sub-schema to track progress for each module within an enrolled course
const moduleProgressSchema = mongoose.Schema(
  {
    moduleId: {
      // The custom 'id' string of the embedded module in the Course document
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    quizAttempts: [
      {
        // Array of Evaluation IDs for quizzes taken for this module
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evaluation",
      },
    ],
    // --- AI-Specific Addition ---
    aiTutoringSessions: [
      {
        // Record of AI tutoring sessions related to this module
        sessionId: { type: String }, // Or ObjectId if you track sessions in a separate collection
        timestamp: { type: Date, default: Date.now },
        // Maybe a summary of AI interaction or areas of focus
      },
    ],
  },
  { _id: false }
);

const enrollmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      // e.g., 'in-progress', 'completed', 'dropped'
      type: String,
      enum: ["enrolled", "in-progress", "completed", "dropped"],
      default: "enrolled",
    },
    progressPercentage: {
      // Calculated total progress for the course
      type: Number,
      default: 0,
    },
    moduleProgress: [moduleProgressSchema], // Array of progress for each module
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedModule: {
      // The `id` string of the last module the user viewed
      type: String,
    },
    // --- AI-Specific Additions ---
    aiPersonalizedLearningPath: [
      {
        // AI-generated sequence of modules or additional resources
        type: String, // e.g., module ID or external resource URL
      },
    ],
    aiRecommendations: [
      {
        // AI-recommended next steps, courses, etc.
        type: String,
      },
    ],
  },
  {
    timestamps: true, // `createdAt` (enrolledAt) and `updatedAt` (last progress update)
  }
);

// Ensure a user can only enroll in a specific course once
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema,
  "enrollments"
);
module.exports = Enrollment;
