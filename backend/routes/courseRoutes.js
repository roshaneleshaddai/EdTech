// backend/routes/courseRoutes.js
const express = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");
const moduleRoutes = require("./moduleRoutes"); // Import module routes for nesting

const router = express.Router();

// Re-route to module router
router.use("/:courseId/modules", moduleRoutes);

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize(["instructor", "admin"]), createCourse); // Only instructors/admins can create courses

router
  .route("/:id")
  .get(getCourseById)
  .put(protect, authorize(["instructor", "admin"]), updateCourse) // Only instructor/admin can update their course
  .delete(protect, authorize(["instructor", "admin"]), deleteCourse); // Only instructor/admin can delete their course

module.exports = router;
