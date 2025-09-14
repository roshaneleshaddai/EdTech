// backend/models/Course.js
const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Reference to the User who created/instructs the course
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Array of references to modules belonging to this course
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    // Optional: category, level, etc.
    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "UI/UX",
        "Cloud Computing",
        "Other",
      ],
      default: "Other",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema , "courses");
module.exports = Course;
