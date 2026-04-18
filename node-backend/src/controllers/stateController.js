const stateRepository = require("../repository/stateRepository");
const sendResponse = require("../utils/responseHandler");
const { validate } = require("../utils/validate");

exports.createState = async (req, res) => {
  try {
    const { name, status } = req.body;
    const validationError = validate({ name, status });
    if (validationError) return sendResponse(res, 400, validationError);

    const state = await stateRepository.createState(name, status);
    return sendResponse(res, 201, "State created successfully", state);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.getStates = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await stateRepository.getStates(search, page, limit);
    return sendResponse(res, 200, "States retrieved successfully", {
      totalItems: result.count,
      states: result.rows,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.getActiveStates = async (req, res) => {
  try {
    const states = await stateRepository.getActiveStates();
    return sendResponse(res, 200, "Active states retrieved successfully", states);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const state = await stateRepository.updateState(id, name, status);
    if (!state) return sendResponse(res, 404, "State not found");

    return sendResponse(res, 200, "State updated successfully", state);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await stateRepository.deleteState(id);
    if (!success) return sendResponse(res, 404, "State not found");

    return sendResponse(res, 200, "State deleted successfully");
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendResponse(res, 400, "Status is required");
    }

    const state = await stateRepository.updateStatus(id, status);
    if (!state) return sendResponse(res, 404, "State not found");

    return sendResponse(res, 200, "State status updated successfully", state);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};
