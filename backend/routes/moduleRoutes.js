// backend/routes/moduleRoutes.js
const express = require("express");
const {
  getModulesByCourse,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true }); // Merge params from parent router (courseId)

router
  .route("/")
  .get(getModulesByCourse)
  .post(protect, authorize(["instructor", "admin"]), createModule); // Only instructors/admins can create modules

router
  .route("/:id")
  .get(getModuleById)
  .put(protect, authorize(["instructor", "admin"]), updateModule) // Only instructor/admin can update their module
  .delete(protect, authorize(["instructor", "admin"]), deleteModule); // Only instructor/admin can delete their module

module.exports = router;
