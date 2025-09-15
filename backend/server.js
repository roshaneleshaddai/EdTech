// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes"); // <<< Add this import

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON

// IMPORTANT: Ensure process.env.FRONTEND_URL is set in your .env file
// e.g., FRONTEND_URL=http://localhost:3000
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // Allow requests from your frontend

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes); // Main course routes
// --- Add this line to mount module routes nested under courseId ---
app.use("/api/courses/:courseId/modules", moduleRoutes); // <<< New line

// Basic route for home
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Not Found Middleware (for routes not found)
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error Handling Middleware (must be the last middleware)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
