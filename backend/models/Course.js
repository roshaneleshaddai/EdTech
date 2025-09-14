// backend/models/Course.js
const mongoose = require("mongoose");
const embeddedModuleSchema = require("./Module"); // Import the embedded module schema

// Sub-schema for the final project details
const finalProjectSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    evaluationCriteria: [{ type: String }],
    // --- AI-Specific Addition ---
    aiProjectGenerationPrompt: { type: String }, // Prompt used by AI to create this project
  },
  { _id: false }
);

// Sub-schema for course ratings
const ratingSchema = mongoose.Schema(
  {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const courseSchema = mongoose.Schema(
  {
    // Custom string ID from your sample, useful for predefined courses
    id: {
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
      // Added from sample
      type: String, // e.g., "8 hours", "2 weeks"
    },
    difficulty: {
      // Added from sample
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
        "AI/Machine Learning", // Added AI as a common category
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        // Added from sample
        type: String,
      },
    ],

    // --- Modules are now EMBEDDED ---
    modules: [embeddedModuleSchema], // Use the defined embeddedModuleSchema

    finalProject: finalProjectSchema, // Added embedded final project details

    createdBy: {
      // Can be a User ObjectId or just a string like 'AI' for predefined/generated
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // If created by AI or system, this could be null
    },
    // The instructor field is redundant if `createdBy` is the instructor,
    // or if `createdBy` is for the system and `instructor` is for human oversight.
    // For now, I'll assume `createdBy` covers the original instructor/source.
    // If you need *both*, clarify if `createdBy` is initial source and `instructor` is active human tutor.
    // Keeping `instructor` for now as it was in original, but `createdBy` is more aligned with sample.
    instructor: {
      // Original instructor field, if distinct from `createdBy`
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Not strictly required if createdBy handles it for AI courses
    },

    isPredefined: {
      // Added from sample (e.g., system courses)
      type: Boolean,
      default: false,
    },
    isPublic: {
      // Added from sample (visible to everyone)
      type: Boolean,
      default: true,
    },
    thumbnail: {
      // Added from sample (URL to course thumbnail)
      type: String,
      default: null,
    },
    rating: ratingSchema, // Added embedded rating system
    enrollmentCount: {
      // Added from sample
      type: Number,
      default: 0,
    },
    completionCount: {
      // Added from sample
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

const Course = mongoose.model("Course", courseSchema, "courses");
module.exports = Course;
