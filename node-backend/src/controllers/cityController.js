const cityRepository = require("../repository/cityRepository");
const stateRepository = require("../repository/stateRepository");
const sendResponse = require("../utils/responseHandler");
const { validate } = require("../utils/validate");

exports.createCity = async (req, res) => {
  try {
    const { stateId, name, status } = req.body;
    const validationError = validate({ stateId, name, status });
    if (validationError) return sendResponse(res, 400, validationError);

    const state = await stateRepository.getStateById(stateId);
    if (!state) return sendResponse(res, 404, "State not found");

    const city = await cityRepository.createCity(stateId, name, status);
    return sendResponse(res, 201, "City created successfully", city);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.getCities = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await cityRepository.getCities(search, page, limit);
    return sendResponse(res, 200, "Cities retrieved successfully", {
      totalItems: result.count,
      cities: result.rows,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { stateId, name, status } = req.body;

    if (stateId) {
      const state = await stateRepository.getStateById(stateId);
      if (!state) return sendResponse(res, 404, "State not found");
    }

    const city = await cityRepository.updateCity(id, stateId, name, status);
    if (!city) return sendResponse(res, 404, "City not found");

    return sendResponse(res, 200, "City updated successfully", city);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await cityRepository.deleteCity(id);
    if (!success) return sendResponse(res, 404, "City not found");

    return sendResponse(res, 200, "City deleted successfully");
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const city = await cityRepository.updateCityStatus(id, status);
    if (!city) return sendResponse(res, 404, "City not found");
    
    return sendResponse(res, 200, "City status updated successfully", city);
  } catch {
    return sendResponse(res, 500, "Something went wrong");
  }
};
