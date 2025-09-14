// backend/models/Module.js
const mongoose = require("mongoose");

// Sub-schema for the rich content field within a module
const moduleContentSchema = mongoose.Schema(
  {
    videoScript: {
      // Text for AI to deliver or for subtitles
      type: String,
      required: true,
    },
    keyConcepts: [
      {
        // Array of key concepts to be covered
        type: String,
      },
    ],
    practicalExamples: [
      {
        // Array of practical scenarios or use cases
        type: String,
      },
    ],
    handsOnActivity: {
      // Description of an activity
      type: String,
    },
    // --- AI-Specific Additions ---
    aiPrompts: [
      {
        // Prompts/instructions used by AI to generate this content
        type: String,
      },
    ],
    aiGeneratedDetails: {
      // Metadata about AI generation
      modelUsed: String,
      temperature: Number,
      tokens: Number,
      timestamp: { type: Date, default: Date.now },
    },
    visualAssetDescriptions: [
      {
        // Descriptions for 3D model scenes/animations
        type: String,
      },
    ],
  },
  { _id: false }
); // No _id for this nested document

// Sub-schema for an embedded Module within a Course
const embeddedModuleSchema = mongoose.Schema(
  {
    // The 'id' field from your sample (custom string ID for the module)
    id: {
      type: String,
      required: true,
      unique: false, // Not unique across all modules, but unique within a course's modules array
    },
    title: {
      // Corresponds to 'module name'
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    topics: [
      {
        // Corresponds to 'module topics' - flat array for easy searching
        type: String,
      },
    ],
    duration: {
      type: String, // e.g., "60 minutes", "1.5 hours"
    },
    order: {
      // To define the sequence of modules
      type: Number,
      required: true,
    },
    type: {
      // e.g., 'lesson', 'quiz', 'project', 'introduction'
      type: String,
      enum: ["lesson", "quiz", "project", "introduction", "summary"],
      default: "lesson",
    },
    content: moduleContentSchema, // Embedded rich content
    prerequisites: [
      {
        // Array of module IDs that must be completed first
        type: String,
      },
    ],
    learningObjectives: [
      {
        // Specific outcomes for the module
        type: String,
      },
    ],
    // isCompleted & completedAt are user-specific and should not be in the module definition.
    // They belong in a UserCourseProgress/Enrollment schema.
  },
  {
    timestamps: true, // Timestamps for when the module itself was defined/updated
  }
);

// We're exporting the schema directly to be embedded in Course.js
module.exports = embeddedModuleSchema;

// If you *still* wanted a separate Module collection for some reason (e.g., shared modules),
// you would export it like this:
// const Module = mongoose.model('Module', embeddedModuleSchema, 'modules');
// module.exports = Module;
// But the Course schema would then reference it via ObjectId, not embed it.
