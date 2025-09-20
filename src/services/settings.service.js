const prisma = require("../config/database");

class SettingsService {
  static async getSettings() {
    try {
      let settings = await prisma.settings.findFirst();

      if (!settings) {
        settings = await prisma.settings.create({
          data: {
            fabricPrice: 3.16,
            fabricMeter: 1.5,
            overhead050: 12.5,
            overhead51100: 12.5,
            overhead101200: 10,
            profit050: 30,
            profit51100: 25,
            profit101200: 15,
            taxRate: 30,
            commRate: 5,
          },
        });
      }

      return settings;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SettingsService;
