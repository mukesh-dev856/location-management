const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status: status === 200 || status === 201,
    message: message,
    data: data
  });
};

module.exports = sendResponse;