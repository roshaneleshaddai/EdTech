// backend/models/Course.js
const mongoose = require("mongoose");
// We no longer import embeddedModuleSchema here, as modules are now referenced, not embedded directly.

// Sub-schema for the final project details, embedded directly in the Course document
const finalProjectSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    evaluationCriteria: [{ type: String }],
    aiProjectGenerationPrompt: { type: String }, // Prompt used by AI to create this project
  },
  { _id: false }
);

// Sub-schema for course ratings, embedded directly in the Course document
const ratingSchema = mongoose.Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const courseSchema = mongoose.Schema(
  {
    // A custom string ID for courses, useful for predefined courses (like 'predefined_web_dev_fundamentals')
    customId: {
      // Renamed from 'id' to 'customId' for clarity and to avoid conflict with MongoDB's _id
      type: String,
      required: false, // Can be null for dynamically created courses
      unique: true,
      sparse: true, // Allows null values, but ensures uniqueness if present
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    estimatedDuration: {
      // Added from your sample
      type: String, // e.g., "8 hours", "2 weeks"
    },
    difficulty: {
      // Added from your sample
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "UI/UX",
        "Cloud Computing",
        "AI/Machine Learning",
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        // Added from your sample
        type: String,
      },
    ],

    // --- Modules are now REFERENCED by ObjectId ---
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module", // This references documents in the 'modules' collection
      },
    ],

    finalProject: finalProjectSchema, // Embedded final project details

    // `createdBy` refers to the User (Instructor/Admin) who initiated the course creation.
    // This could be a human user or a system user for AI-generated courses.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // If created by AI or system, this could be null
    },
    // `instructor` explicitly refers to the human assigned as the primary instructor for the course.
    // This allows distinguishing who created the course vs. who is currently teaching/managing it.
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // A course might not have a direct human instructor if it's AI-led, but good to have.
    },

    isPredefined: {
      // Added from your sample (e.g., system courses)
      type: Boolean,
      default: false,
    },
    isPublic: {
      // Added from your sample (visible to everyone)
      type: Boolean,
      default: true,
    },
    thumbnail: {
      // Added from your sample (URL to course thumbnail)
      type: String,
      default: null,
    },
    rating: ratingSchema, // Embedded rating system
    enrollmentCount: {
      // Added from your sample
      type: Number,
      default: 0,
    },
    completionCount: {
      // Added from your sample
      type: Number,
      default: 0,
    },

    // --- AI-Specific Additions ---
    aiGenerationMetadata: {
      // Store details about AI generating the course structure
      modelUsed: String,
      initialPrompt: String,
      timestamp: { type: Date, default: Date.now },
      // Other relevant AI parameters
    },
  },
  {
    timestamps: true, // `createdAt` and `updatedAt` for the course document
  }
);

// Export as a Mongoose Model, to be used for a standalone collection named 'courses'
const Course = mongoose.model("Course", courseSchema, "courses");
module.exports = Course;
