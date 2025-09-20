// API Configuration
const API_BASE_URL = "http://localhost:8085/api";

// Global State
let currentPage = 1;
let currentFilters = {};
let companies = [];
let currentCalculation = null;

// DOM Elements
const elements = {
  // Form elements
  form: document.getElementById("calculationForm"),
  companySelect: document.getElementById("companyId"),
  packageSelect: document.getElementById("packageType"),
  calculateBtn: document.getElementById("calculateBtn"),
  clearBtn: document.getElementById("clearForm"),

  // Exchange rate
  eurRate: document.getElementById("eurRate"),
  rateTime: document.getElementById("rateTime"),

  // Results
  resultsSection: document.getElementById("resultsSection"),
  totalCost: document.getElementById("totalCost"),
  eurEquivalent: document.getElementById("eurEquivalent"),
  profitMargin: document.getElementById("profitMargin"),
  taxIncluded: document.getElementById("taxIncluded"),
  breakdownTableBody: document.getElementById("breakdownTableBody"),
  exportBtn: document.getElementById("exportResults"),

  // History
  historyTableBody: document.getElementById("historyTableBody"),
  historyFilter: document.getElementById("historyFilter"),
  refreshHistoryBtn: document.getElementById("refreshHistory"),
  pagination: document.getElementById("pagination"),

  // Loading
  loadingOverlay: document.getElementById("loadingOverlay"),
  toastContainer: document.getElementById("toastContainer"),
};

// Utility Functions
const utils = {
  formatCurrency: (amount, currency = "TL") => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency === "EUR" ? "EUR" : "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatNumber: (number, decimals = 2) => {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },

  formatDate: (date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  },

  showLoading: () => {
    elements.loadingOverlay.classList.add("show");
  },

  hideLoading: () => {
    elements.loadingOverlay.classList.remove("show");
  },

  showToast: (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon =
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "exclamation-triangle";

    toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// API Functions
const api = {
  async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  async getCompanies() {
    return await this.request("/companies");
  },

  async createCalculation(data) {
    return await this.request("/calculations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getCalculations(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.request(`/calculations?${params}`);
  },

  async getExchangeRate() {
    try {
      const response = await this.request("/exchange-rate");
      return response.data;
    } catch (error) {
      console.error("Exchange rate fetch failed:", error);
      return {
        eurRate: 37.99,
        lastUpdated: new Date(),
      };
    }
  },
};

// Exchange Rate Management
const exchangeRate = {
  currentRate: 37.99,
  lastUpdated: null,

  async update() {
    try {
      const rateData = await api.getExchangeRate();
      this.currentRate = rateData.eurRate;
      this.lastUpdated = rateData.lastUpdated;
      this.display();
    } catch (error) {
      console.error("Failed to update exchange rate:", error);
      utils.showToast("Döviz kuru güncellenemedi", "warning");
    }
  },

  display() {
    elements.eurRate.textContent = utils.formatNumber(this.currentRate, 4);
    elements.rateTime.textContent = utils.formatDate(this.lastUpdated);
  },

  startAutoUpdate() {
    // Update every 5 minutes
    setInterval(() => {
      this.update();
    }, 5 * 60 * 1000);
  },
};

// Company Management
const companyManager = {
  async loadCompanies() {
    try {
      utils.showLoading();
      const response = await api.getCompanies();
      companies = response.data || [];
      this.populateSelect();
    } catch (error) {
      console.error("Failed to load companies:", error);
      utils.showToast("Şirketler yüklenemedi", "error");
    } finally {
      utils.hideLoading();
    }
  },

  populateSelect() {
    elements.companySelect.innerHTML =
      '<option value="">Şirket seçin...</option>';

    companies.forEach((company) => {
      const option = document.createElement("option");
      option.value = company.id;
      option.textContent = company.name;
      elements.companySelect.appendChild(option);
    });
  },
};

// Form Management
const formManager = {
  init() {
    this.bindEvents();
    this.setDefaultValues();
  },

  bindEvents() {
    elements.form.addEventListener("submit", this.handleSubmit.bind(this));
    elements.clearBtn.addEventListener("click", this.clearForm.bind(this));

    // Real-time validation
    const inputs = elements.form.querySelectorAll('input[type="number"]');
    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        utils.debounce(this.validateInput.bind(this), 300)
      );
    });
  },

  setDefaultValues() {
    // Set default values based on your business logic
    document.getElementById("fabricPrice").value = "3.16";
    document.getElementById("fabricMeter").value = "1.5";
  },

  validateInput(event) {
    const input = event.target;
    const value = parseFloat(input.value);

    if (isNaN(value) || value < 0) {
      input.style.borderColor = "var(--error-color)";
      return false;
    } else {
      input.style.borderColor = "var(--border-color)";
      return true;
    }
  },

  getFormData() {
    const formData = new FormData(elements.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (key === "companyId") {
        data[key] = parseInt(value);
      } else if (key === "packageType") {
        data[key] = value;
      } else {
        data[key] = parseFloat(value) || 0;
      }
    }

    return data;
  },

  validateForm() {
    const data = this.getFormData();
    const requiredFields = [
      "companyId",
      "packageType",
      "fabricPrice",
      "fabricMeter",
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        utils.showToast(`${field} alanı zorunludur`, "error");
        return false;
      }
    }

    return true;
  },

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    try {
      utils.showLoading();
      elements.calculateBtn.disabled = true;

      const formData = this.getFormData();
      const response = await api.createCalculation(formData);

      if (response.success) {
        currentCalculation = response.data;
        resultsManager.displayResults(response.data);
        utils.showToast("Hesaplama başarıyla tamamlandı!", "success");
        historyManager.loadHistory(); // Refresh history
      } else {
        throw new Error(response.message || "Hesaplama başarısız");
      }
    } catch (error) {
      console.error("Calculation failed:", error);
      utils.showToast("Hesaplama başarısız: " + error.message, "error");
    } finally {
      utils.hideLoading();
      elements.calculateBtn.disabled = false;
    }
  },

  clearForm() {
    elements.form.reset();
    this.setDefaultValues();
    resultsManager.hideResults();
    utils.showToast("Form temizlendi", "success");
  },
};

// Results Management
const resultsManager = {
  displayResults(calculation) {
    this.updateSummaryCards(calculation);
    this.updateBreakdownTable(calculation);
    elements.resultsSection.style.display = "block";
    elements.resultsSection.scrollIntoView({ behavior: "smooth" });
  },

  updateSummaryCards(calculation) {
    elements.totalCost.textContent = utils.formatCurrency(
      calculation.totalPrice
    );
    elements.eurEquivalent.textContent = utils.formatCurrency(
      calculation.laborCostInEUR,
      "EUR"
    );
    elements.profitMargin.textContent =
      utils.formatNumber(calculation.profitMargin) + "%";
    elements.taxIncluded.textContent = utils.formatCurrency(
      calculation.totalPrice
    );
  },

  updateBreakdownTable(calculation) {
    const breakdown = [
      {
        label: "Kumaş Maliyeti",
        amount: calculation.fabricPrice * calculation.fabricMeter,
        eur:
          (calculation.fabricPrice * calculation.fabricMeter) /
          calculation.eurRate,
        percentage:
          ((calculation.fabricPrice * calculation.fabricMeter) /
            calculation.totalPrice) *
          100,
      },
      {
        label: "Kesim İşlemi",
        amount: calculation.cutProcess,
        eur: calculation.cutProcess / calculation.eurRate,
        percentage: (calculation.cutProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Dikiş İşlemi",
        amount: calculation.sationProcess,
        eur: calculation.sationProcess / calculation.eurRate,
        percentage: (calculation.sationProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Yıkama İşlemi",
        amount: calculation.washProcess,
        eur: calculation.washProcess / calculation.eurRate,
        percentage: (calculation.washProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Baskı İşlemi",
        amount: calculation.printProcess,
        eur: calculation.printProcess / calculation.eurRate,
        percentage: (calculation.printProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Giyim İşlemi",
        amount: calculation.wearProcess,
        eur: calculation.wearProcess / calculation.eurRate,
        percentage: (calculation.wearProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Aksesuar İşlemi",
        amount: calculation.accessoryProcess,
        eur: calculation.accessoryProcess / calculation.eurRate,
        percentage:
          (calculation.accessoryProcess / calculation.totalPrice) * 100,
      },
      {
        label: "Düğme İşlemi",
        amount: calculation.buttonProcess,
        eur: calculation.buttonProcess / calculation.eurRate,
        percentage: (calculation.buttonProcess / calculation.totalPrice) * 100,
      },
      {
        label: "İşçilik Maliyeti",
        amount: calculation.laborCost,
        eur: calculation.laborCostInEUR,
        percentage: (calculation.laborCost / calculation.totalPrice) * 100,
      },
      {
        label: "Genel Giderler",
        amount: calculation.overheadCost,
        eur: calculation.overheadCost / calculation.eurRate,
        percentage: (calculation.overheadCost / calculation.totalPrice) * 100,
      },
      {
        label: "Komisyon",
        amount: calculation.commission,
        eur: calculation.commission / calculation.eurRate,
        percentage: (calculation.commission / calculation.totalPrice) * 100,
      },
      {
        label: "KDV",
        amount: calculation.tax,
        eur: calculation.tax / calculation.eurRate,
        percentage: (calculation.tax / calculation.totalPrice) * 100,
      },
    ];

    elements.breakdownTableBody.innerHTML = "";

    breakdown.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${item.label}</td>
                <td>${utils.formatCurrency(item.amount)}</td>
                <td>${utils.formatCurrency(item.eur, "EUR")}</td>
                <td>${utils.formatNumber(item.percentage)}%</td>
            `;
      elements.breakdownTableBody.appendChild(row);
    });
  },

  hideResults() {
    elements.resultsSection.style.display = "none";
  },

  exportResults() {
    if (!currentCalculation) {
      utils.showToast("Dışa aktarılacak hesaplama bulunamadı", "error");
      return;
    }

    // Create CSV content
    const csvContent = this.generateCSV(currentCalculation);
    this.downloadCSV(csvContent, `denim-hesaplama-${Date.now()}.csv`);
    utils.showToast("Hesaplama dışa aktarıldı", "success");
  },

  generateCSV(calculation) {
    const headers = ["Kalem", "Tutar (TL)", "EUR", "%"];
    const rows = [
      [
        "Kumaş Maliyeti",
        calculation.fabricPrice * calculation.fabricMeter,
        (calculation.fabricPrice * calculation.fabricMeter) /
          calculation.eurRate,
        ((calculation.fabricPrice * calculation.fabricMeter) /
          calculation.totalPrice) *
          100,
      ],
      [
        "Kesim İşlemi",
        calculation.cutProcess,
        calculation.cutProcess / calculation.eurRate,
        (calculation.cutProcess / calculation.totalPrice) * 100,
      ],
      [
        "Dikiş İşlemi",
        calculation.sationProcess,
        calculation.sationProcess / calculation.eurRate,
        (calculation.sationProcess / calculation.totalPrice) * 100,
      ],
      [
        "Yıkama İşlemi",
        calculation.washProcess,
        calculation.washProcess / calculation.eurRate,
        (calculation.washProcess / calculation.totalPrice) * 100,
      ],
      [
        "Baskı İşlemi",
        calculation.printProcess,
        calculation.printProcess / calculation.eurRate,
        (calculation.printProcess / calculation.totalPrice) * 100,
      ],
      [
        "Giyim İşlemi",
        calculation.wearProcess,
        calculation.wearProcess / calculation.eurRate,
        (calculation.wearProcess / calculation.totalPrice) * 100,
      ],
      [
        "Aksesuar İşlemi",
        calculation.accessoryProcess,
        calculation.accessoryProcess / calculation.eurRate,
        (calculation.accessoryProcess / calculation.totalPrice) * 100,
      ],
      [
        "Düğme İşlemi",
        calculation.buttonProcess,
        calculation.buttonProcess / calculation.eurRate,
        (calculation.buttonProcess / calculation.totalPrice) * 100,
      ],
      [
        "İşçilik Maliyeti",
        calculation.laborCost,
        calculation.laborCostInEUR,
        (calculation.laborCost / calculation.totalPrice) * 100,
      ],
      [
        "Genel Giderler",
        calculation.overheadCost,
        calculation.overheadCost / calculation.eurRate,
        (calculation.overheadCost / calculation.totalPrice) * 100,
      ],
      [
        "Komisyon",
        calculation.commission,
        calculation.commission / calculation.eurRate,
        (calculation.commission / calculation.totalPrice) * 100,
      ],
      [
        "KDV",
        calculation.tax,
        calculation.tax / calculation.eurRate,
        (calculation.tax / calculation.totalPrice) * 100,
      ],
      ["TOPLAM", calculation.totalPrice, calculation.laborCostInEUR, "100.00"],
    ];

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  },

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// History Management
const historyManager = {
  async loadHistory(page = 1) {
    try {
      utils.showLoading();
      const filters = {
        ...currentFilters,
        packageType: elements.historyFilter.value || undefined,
      };

      const response = await api.getCalculations(page, 10, filters);

      if (response.success) {
        this.displayHistory(response.data);
        this.updatePagination(response.pagination);
        currentPage = page;
      } else {
        throw new Error(response.message || "Geçmiş yüklenemedi");
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      utils.showToast("Geçmiş yüklenemedi: " + error.message, "error");
    } finally {
      utils.hideLoading();
    }
  },

  displayHistory(calculations) {
    elements.historyTableBody.innerHTML = "";

    if (calculations.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td colspan="6" style="text-align: center; padding: 2rem;">Henüz hesaplama bulunmuyor</td>';
      elements.historyTableBody.appendChild(row);
      return;
    }

    calculations.forEach((calculation) => {
      const row = document.createElement("tr");
      const packageTypeText = this.getPackageTypeText(calculation.packageType);

      row.innerHTML = `
                <td>${utils.formatDate(calculation.createdAt)}</td>
                <td>${calculation.company.name}</td>
                <td>${packageTypeText}</td>
                <td>${utils.formatCurrency(calculation.totalPrice)}</td>
                <td>${utils.formatCurrency(
                  calculation.laborCostInEUR,
                  "EUR"
                )}</td>
                <td>
                    <button class="btn btn-outline" onclick="historyManager.viewCalculation(${
                      calculation.id
                    })">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
      elements.historyTableBody.appendChild(row);
    });
  },

  getPackageTypeText(packageType) {
    const types = {
      PACKAGE_050: "0-50 Adet",
      PACKAGE_51100: "51-100 Adet",
      PACKAGE_101200: "101-200 Adet",
    };
    return types[packageType] || packageType;
  },

  updatePagination(pagination) {
    elements.pagination.innerHTML = "";

    const { page, pages, total } = pagination;

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = page <= 1;
    prevBtn.onclick = () => this.loadHistory(page - 1);
    elements.pagination.appendChild(prevBtn);

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(pages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.className = i === page ? "active" : "";
      pageBtn.onclick = () => this.loadHistory(i);
      elements.pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = page >= pages;
    nextBtn.onclick = () => this.loadHistory(page + 1);
    elements.pagination.appendChild(nextBtn);

    // Total info
    const info = document.createElement("span");
    info.textContent = `Toplam ${total} kayıt`;
    info.style.marginLeft = "1rem";
    info.style.color = "var(--text-secondary)";
    elements.pagination.appendChild(info);
  },

  viewCalculation(id) {
    // This would open a modal or navigate to a detail view
    utils.showToast("Hesaplama detayı gösterilecek", "info");
  },

  init() {
    elements.historyFilter.addEventListener("change", () => {
      this.loadHistory(1);
    });

    elements.refreshHistoryBtn.addEventListener("click", () => {
      this.loadHistory(currentPage);
    });
  },
};

// Initialize Application
const app = {
  async init() {
    try {
      // Initialize exchange rate
      await exchangeRate.update();
      exchangeRate.startAutoUpdate();

      // Load companies
      await companyManager.loadCompanies();

      // Initialize form
      formManager.init();

      // Initialize history
      historyManager.init();
      await historyManager.loadHistory();

      // Bind export button
      elements.exportBtn.addEventListener(
        "click",
        resultsManager.exportResults.bind(resultsManager)
      );

      utils.showToast("Uygulama başarıyla yüklendi!", "success");
    } catch (error) {
      console.error("Application initialization failed:", error);
      utils.showToast("Uygulama başlatılamadı", "error");
    }
  },
};

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", app.init);
