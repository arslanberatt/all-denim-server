const SettingsService = require("../services/settingsService");

async function getSettingsController(req, res) {
  try {
    const settings = await SettingsService.getSettings();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ayarlar getirilemedi",
      error: error.message,
    });
  }
}

module.exports = {
  getSettingsController,
};
