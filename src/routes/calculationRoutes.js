const express = require("express");
const CalculationController = require("../controllers/calculationController");
const { validateCalculation } = require("../middleware/validation");

const router = express.Router();

router.post("/", validateCalculation, CalculationController.createCalculationController);
router.get("/", CalculationController.getAllCalculationsController);
router.get("/:id", CalculationController.getCalculationByIdController);

module.exports = router;