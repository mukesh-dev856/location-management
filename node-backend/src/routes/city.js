const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

router.post("/", cityController.createCity);
router.get("/", cityController.getCities);
router.put("/:id", cityController.updateCity);
router.patch("/:id/status", cityController.changeStatus);
router.delete("/:id", cityController.deleteCity);

module.exports = router;
