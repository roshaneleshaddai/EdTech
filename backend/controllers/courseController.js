// backend/controllers/courseController.js
const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const Module = require("../models/Module"); // <<< IMPORTANT: Make sure Module model is imported here

// @desc    Get all courses
// @route   GET /api/courses
// @access  Protected
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Protected
const getCourseById = asyncHandler(async (req, res) => {
  // --- THIS IS THE CRITICAL CHANGE/CHECK YOU NEED TO MAKE ---
  const course = await Course.findById(req.params.id).populate({
    path: "modules", // The name of the field in your Course schema that holds references to Modules
    model: "Module", // The Mongoose model that those references point to
    options: { sort: { order: 1 } }, // Sort the populated modules by their 'order' field
  });
  // --- END CRITICAL CHANGE/CHECK ---

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, difficulty, estimatedDuration, tags } =
    req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please enter all required fields for the course.");
  }

  const course = new Course({
    title,
    description,
    category: category || "Uncategorized",
    difficulty: difficulty || "Beginner",
    estimatedDuration: estimatedDuration || "Unknown",
    tags: tags || [],
    createdBy: req.user._id,
    instructor: req.user._id,
    isPredefined: false,
    isPublic: true,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin (only owner or admin)
const updateCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    difficulty,
    estimatedDuration,
    tags,
    isPublic,
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to update this course");
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    course.estimatedDuration = estimatedDuration || course.estimatedDuration;
    course.tags = tags || course.tags;
    course.isPublic = isPublic !== undefined ? isPublic : course.isPublic;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin (only owner or admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this course");
    }

    await Module.deleteMany({ course: req.params.id });
    await Course.deleteOne({ _id: req.params.id });
    res.json({ message: "Course removed" });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
