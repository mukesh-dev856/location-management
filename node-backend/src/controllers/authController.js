const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repository/userRepository");
const sendResponse = require("../utils/responseHandler");
const { validate, validateEmail } = require("../utils/validate");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validate({ name, email, password });
    if (validationError) {
      return sendResponse(res, 400, validationError);
    }

    if (!validateEmail(email)) {
      return sendResponse(res, 400, "Invalid email format");
    }

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return sendResponse(res, 400, "User already exists with this email.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userRepository.createUser(name, email, hashedPassword);

    const newUser = await userRepository.findUserByEmail(email);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1d",
    });

    return sendResponse(res, 201, "User registered successfully", {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return sendResponse(res, 500, "Server error during registration.");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validate({ email, password });
    if (validationError) {
      return sendResponse(res, 400, validationError);
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return sendResponse(res, 400, "Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, "Invalid credentials.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1d",
    });

    return sendResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return sendResponse(res, 500, "Server error during login.");
  }
};

exports.logout = (req, res) => {
  // For JWT, logout is often handled by the client by removing the token.
  return sendResponse(res, 200, "Logout successful. Please remove token on client side.");
};
