// backend/models/Module.js
const mongoose = require('mongoose');

// Sub-schema for the rich content field within a module
// This content will be embedded directly in the Module document itself.
const moduleContentSchema = mongoose.Schema({
  videoScript: { // Text for AI to deliver or for subtitles
    type: String,
    required: false,
    default: "",
  },
  keyConcepts: [{ // Array of key concepts to be covered
    type: String,
  }],
  practicalExamples: [{ // Array of practical scenarios or use cases
    type: String,
  }],
  handsOnActivity: { // Description of an activity
    type: String,
  },
  // --- AI-Specific Additions ---
  aiPrompts: [{ // Prompts/instructions used by AI to generate this content
    type: String,
  }],
  aiGeneratedDetails: { // Metadata about AI generation
    modelUsed: String,
    temperature: Number,
    tokens: Number,
    timestamp: { type: Date, default: Date.now },
  },
  visualAssetDescriptions: [{ // Descriptions for 3D model scenes/animations
    type: String,
  }],
}, { _id: false }); // No _id for this nested document

// The main schema for a standalone Module document
const moduleSchema = mongoose.Schema(
  {
    // A custom string ID for logical referencing (e.g., in prerequisites)
    // This allows referring to "module_html_intro" without needing its MongoDB _id
    customId: {
      type: String,
      required: false,
      unique: true, // This customId must be unique across all modules
      sparse: true, // Allow documents without customId
    },
    course: { // Reference to the parent course using ObjectId
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course', // This references the 'courses' collection
    },
    title: { // Corresponds to 'module name' from your request
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    topics: [{ // Corresponds to 'module topics' from your request
      type: String,
    }],
    duration: { // e.g., "60 minutes", "1.5 hours"
      type: String,
    },
    order: { // To define the sequence of modules within a course
      type: Number,
      required: true,
    },
    type: { // e.g., 'lesson', 'quiz', 'project', 'introduction', 'summary'
      type: String,
      enum: ['lesson', 'quiz', 'project', 'introduction', 'summary'],
      default: 'lesson',
    },
    content: moduleContentSchema, // Embedded rich content details within THIS module document
    prerequisites: [{ // Array of `customId` strings of other modules that must be completed first
      type: String,
    }],
    learningObjectives: [{ // Specific outcomes for the module
      type: String,
    }],
  },
  {
    timestamps: true, // `createdAt` and `updatedAt` for when this module document was created/updated
  }
);

// Export as a Mongoose Model, to be used for a standalone collection named 'modules'
const Module = mongoose.model('Module', moduleSchema, 'modules');
module.exports = Module;