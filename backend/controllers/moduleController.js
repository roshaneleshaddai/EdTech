// backend/controllers/moduleController.js
const asyncHandler = require("express-async-handler");
const Module = require("../models/Module");
const Course = require("../models/Course"); // To update course's modules array

// @desc    Get all modules for a specific course
// @route   GET /api/courses/:courseId/modules
// @access  Public
const getModulesByCourse = asyncHandler(async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId }).sort({
    order: 1,
  });
  res.json(modules);
});

// @desc    Get a single module by ID for a specific course
// @route   GET /api/courses/:courseId/modules/:id
// @access  Public
const getModuleById = asyncHandler(async (req, res) => {
  const module = await Module.findOne({
    _id: req.params.id,
    course: req.params.courseId,
  });

  if (module) {
    res.json(module);
  } else {
    res.status(404);
    throw new Error("Module not found for this course");
  }
});

// @desc    Add a new module to a course
// @route   POST /api/courses/:courseId/modules
// @access  Private/Instructor
const createModule = asyncHandler(async (req, res) => {
  const { title, description, content, order, duration } = req.body;
  const courseId = req.params.courseId;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if logged-in user is the instructor of the course
  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to add modules to this course");
  }

  // Ensure 'order' is provided or automatically determine the next order
  const moduleOrder =
    order || (await Module.countDocuments({ course: courseId })) + 1;

  const module = new Module({
    course: courseId,
    title,
    description,
    content,
    order: moduleOrder,
    duration,
  });

  const createdModule = await module.save();

  // Add module reference to the course
  course.modules.push(createdModule._id);
  await course.save();

  res.status(201).json(createdModule);
});

// @desc    Update a module
// @route   PUT /api/courses/:courseId/modules/:id
// @access  Private/Instructor
const updateModule = asyncHandler(async (req, res) => {
  const { title, description, content, order, duration } = req.body;
  const courseId = req.params.courseId;
  const moduleId = req.params.id;

  const module = await Module.findOne({ _id: moduleId, course: courseId });

  if (module) {
    const course = await Course.findById(courseId);
    if (
      !course ||
      (course.instructor.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      res.status(403);
      throw new Error("Not authorized to update this module");
    }

    module.title = title || module.title;
    module.description = description || module.description;
    module.content = content || module.content;
    module.order = order || module.order;
    module.duration = duration || module.duration;

    const updatedModule = await module.save();
    res.json(updatedModule);
  } else {
    res.status(404);
    throw new Error("Module not found for this course");
  }
});

// @desc    Delete a module
// @route   DELETE /api/courses/:courseId/modules/:id
// @access  Private/Instructor/Admin
const deleteModule = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const moduleId = req.params.id;

  const module = await Module.findOne({ _id: moduleId, course: courseId });

  if (module) {
    const course = await Course.findById(courseId);
    if (
      !course ||
      (course.instructor.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      res.status(403);
      throw new Error("Not authorized to delete this module");
    }

    await Module.deleteOne({ _id: moduleId }); // Mongoose 6+

    // Remove module reference from the course
    course.modules = course.modules.filter(
      (modRef) => modRef.toString() !== moduleId.toString()
    );
    await course.save();

    res.json({ message: "Module removed" });
  } else {
    res.status(404);
    throw new Error("Module not found for this course");
  }
});

module.exports = {
  getModulesByCourse,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};
