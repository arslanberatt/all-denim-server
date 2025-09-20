// src/services/calculationService.js
const prisma = require("../config/database");
const { calculatePricing } = require("../utils/helpers");

class CalculationService {
  static async createCalculation(data) {
    try {
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        throw new Error("Ayarlar bulunamadı");
      }
      const calculations = await calculatePricing(data, settings);

      const calculation = await prisma.calculation.create({
        data: {
          companyId: data.companyId,
          packageType: data.packageType,
          cutProcess: data.cutProcess,
          sationProcess: data.sationProcess,
          washProcess: data.washProcess,
          printProcess: data.printProcess,
          wearProcess: data.wearProcess,
          accessoryProcess: data.accessoryProcess,
          buttonProcess: data.buttonProcess,
          ...calculations,
        },
        include: {
          company: true,
        },
      });

      return calculation;
    } catch (error) {
      throw error;
    }
  }

  static async getCalculations(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;

      const where = {};

      if (filters.companyId) {
        where.companyId = parseInt(filters.companyId);
      }

      if (filters.packageType) {
        where.packageType = filters.packageType;
      }

      const [calculations, total] = await Promise.all([
        prisma.calculation.findMany({
          where,
          include: {
            company: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: parseInt(limit),
        }),
        prisma.calculation.count({ where }),
      ]);

      return {
        data: calculations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getCalculationById(id) {
    try {
      const calculation = await prisma.calculation.findUnique({
        where: { id: parseInt(id) },
        include: {
          company: true,
        },
      });

      if (!calculation) {
        throw new Error("Hesaplama bulunamadı");
      }

      return calculation;
    } catch (error) {
      throw error;
    }
  }

  static async getDefaultSettings() {
    try {
      let settings = await prisma.settings.findFirst();

      if (!settings) {
        settings = await prisma.settings.create({
          data: {
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

  static async getStatistics(filters = {}) {
    try {
      const where = {};

      if (filters.companyId) {
        where.companyId = parseInt(filters.companyId);
      }

      if (filters.startDate && filters.endDate) {
        where.createdAt = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }

      const [totalCalculations, totalAmount, averageAmount] = await Promise.all(
        [
          prisma.calculation.count({ where }),
          prisma.calculation.aggregate({
            where,
            _sum: { totalPrice: true },
          }),
          prisma.calculation.aggregate({
            where,
            _avg: { totalPrice: true },
          }),
        ]
      );

      return {
        totalCalculations,
        totalAmount: totalAmount._sum.totalPrice || 0,
        averageAmount: averageAmount._avg.totalPrice || 0,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CalculationService;
