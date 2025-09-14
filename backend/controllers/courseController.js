// backend/controllers/courseController.js
const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const User = require("../models/User"); // To populate instructor info

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate(
    "instructor",
    "username email"
  ); // Populate instructor details
  res.json(courses);
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "username email")
    .populate("modules"); // Populate instructor and modules

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level } = req.body;

  const course = new Course({
    title,
    description,
    instructor: req.user._id, // Instructor is the logged-in user
    category,
    level,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    // Check if the logged-in user is the instructor of the course
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
    course.level = level || course.level;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    // Check if the logged-in user is the instructor of the course OR an admin
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this course");
    }

    // Also delete associated modules
    await mongoose.model("Module").deleteMany({ course: course._id });

    await Course.deleteOne({ _id: req.params.id }); // Mongoose 6+ uses deleteOne
    res.json({ message: "Course and associated modules removed" });
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
