const CalculationService = require("../services/calculationService");

async function createCalculationController(req, res) {
  try {
    const calculation = await CalculationService.createCalculation(req.body);

    res.status(201).json({
      success: true,
      message: "Başarıyla hesaplandı!",
      data: calculation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Maalesef hesaplanamadı!",
      error: error.message,
    });
  }
}

async function getAllCalculationsController(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      companyId,
      packageType,
    } = req.query;

    const filters = {
      companyId,
      packageType,
    };

    const result = await CalculationService.getCalculations(
      page,
      limit,
      filters
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hesaplamalar getirilemedi",
      error: error.message,
    });
  }
}

async function getCalculationByIdController(req, res) {
  try {
    const { id } = req.params;
    const calculation = await CalculationService.getCalculationById(id);

    res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Hesaplama bulunamadı",
      error: error.message,
    });
  }
}

module.exports = {
  createCalculationController,
  getAllCalculationsController,
  getCalculationByIdController,
};
