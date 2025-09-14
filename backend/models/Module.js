// backend/models/Module.js
const mongoose = require("mongoose");

const moduleSchema = mongoose.Schema(
  {
    // Reference to the parent course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      // This could be a URL to a video, text, markdown content, etc.
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    duration: {
      type: String, // e.g., "30 min", "1 hour 15 min"
    },
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("Module", moduleSchema, "modules");
module.exports = Module;
