// src/routes/settingsRoutes.js
const express = require("express");
const SettingsController = require("../controllers/settings.controller");

const router = express.Router();

router.get("/", SettingsController.getSettingsController);

module.exports = router;
