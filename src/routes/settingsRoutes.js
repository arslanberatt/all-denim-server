// src/routes/settingsRoutes.js
const express = require("express");
const SettingsController = require("../controllers/settingsController");

const router = express.Router();

router.get("/", SettingsController.getSettingsController);

module.exports = router;
