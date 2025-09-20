const prisma = require("../config/database");

class CompanyService {
  static async createCompany(name, email, address, contactPerson) {
    try {
      const company = await prisma.company.create({
        data: {
          name,
          email,
          address,
          contactPerson,
        },
      });

      return company;
    } catch (error) {
      throw error;
    }
  }

  static async getAllCompanies() {
    try {
      const companies = await prisma.company.findMany({
        orderBy: { name: "asc" },
      });

      return companies;
    } catch (error) {
      throw error;
    }
  }

  static async getCompanyById(id) {
    try {
      const company = await prisma.company.findUnique({
        where: { id: parseInt(id) },
        include: {
          calculations: true,
        },
      });

      if (!company) {
        throw new Error("Şirket bulunamadı");
      }

      return company;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  createCompany: CompanyService.createCompany,
  getAllCompanies: CompanyService.getAllCompanies,
  getCompanyById: CompanyService.getCompanyById,
};
