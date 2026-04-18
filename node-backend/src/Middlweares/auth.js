const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/responseHandler");

const auth = (req, res, next) => {
  try {
    // Header se token lo
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendResponse(res, "unauthorized", "Token required");
    }

    // Bearer TOKEN format handle
    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendResponse(res, "unauthorized", "Invalid token format");
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // User data save karo
    req.user = decoded;

    next(); // next middleware/controller
  } catch (err) {
    return sendResponse(res, "unauthorized", "Invalid or expired token");
  }
};

module.exports = auth;