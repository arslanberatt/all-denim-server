const CompanyService = require("../services/companyService");

async function createCompanyController(req, res) {
  try {
    const { name, email, address, contactPerson } = req.body;
    const company = await CompanyService.createCompany(
      name,
      email,
      address,
      contactPerson
    );

    res.status(201).json({
      success: true,
      message: "Şirket başarıyla oluşturuldu",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirket oluşturulamadı",
      error: error.message,
    });
  }
}

async function getAllCompaniesController(req, res) {
  try {
    const companies = await CompanyService.getAllCompanies();

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Şirketler getirilemedi",
      error: error.message,
    });
  }
}

async function getCompanyByIdController(req, res) {
  try {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Şirket bulunamadı",
      error: error.message,
    });
  }
}

module.exports = {
  createCompanyController,
  getAllCompaniesController,
  getCompanyByIdController,
};
