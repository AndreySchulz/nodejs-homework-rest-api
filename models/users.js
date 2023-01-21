const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const usersSchema = new mongoose.Schema({
  avatarURL: String,
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: uuidv4(),
    required: [true, "Verify token is required"],
  },
});

const Users = mongoose.model("users", usersSchema);
module.exports = { Users };
