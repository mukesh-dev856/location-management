const express = require("express");
const router = express.Router();
const stateController = require("../controllers/stateController");

router.post("/", stateController.createState);
router.get("/", stateController.getStates);
router.get("/active", stateController.getActiveStates);
router.put("/:id", stateController.updateState);
router.patch("/:id/status", stateController.changeStatus);
router.delete("/:id", stateController.deleteState);

module.exports = router;
