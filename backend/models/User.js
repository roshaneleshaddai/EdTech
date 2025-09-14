// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const preferencesSchema = mongoose.Schema(
  {
    teacher: { type: String, default: null },
    classroom: { type: String, default: "default" },
    notifications: { type: Boolean, default: true },
  },
  { _id: false }
); // Do not create an _id for the nested preferences object

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      // Added
      type: String,
      required: false, // Make optional for registration if you only collect username
    },
    lastName: {
      // Added
      type: String,
      required: false, // Make optional for registration
    },
    avatar: {
      // Added
      type: String, // URL to avatar image
      default: null, // No avatar initially
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    isActive: {
      // Added
      type: Boolean,
      default: true,
    },
    preferences: preferencesSchema, // Added nested preferences schema
    lastLogin: {
      // Added
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // `createdAt` and `updatedAt` are handled by this
  }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
