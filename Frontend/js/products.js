// ZESTAAN - Products Page JavaScript (FakeStoreAPI Version)

// API wrapper
const API = {
  async fetchProducts() {
    // Mock data - no backend call needed
    const mockData = [
      {
        id: "1",
        name: "Premium T-Shirt",
        category: "tops",
        description: "High-quality cotton t-shirt",
        price: 29.99,
        sale_price: 19.99,
        colors: ["black", "white", "blue"],
        sizes: ["S", "M", "L", "XL"],
        tags: ["new", "sale"],
        rating: 4.5,
        created_at: "2024-01-01",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=T-Shirt"
      },
      {
        id: "2",
        name: "Denim Jeans",
        category: "bottoms",
        description: "Classic blue denim jeans",
        price: 59.99,
        sale_price: null,
        colors: ["blue", "black"],
        sizes: ["28", "30", "32", "34"],
        tags: ["popular"],
        rating: 4.7,
        created_at: "2024-01-02",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=Jeans"
      },
      {
        id: "3",
        name: "Casual Jacket",
        category: "outerwear",
        description: "Comfortable casual jacket",
        price: 89.99,
        sale_price: 69.99,
        colors: ["gray", "navy"],
        sizes: ["S", "M", "L", "XL"],
        tags: ["new", "sale"],
        rating: 4.3,
        created_at: "2024-01-03",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=Jacket"
      },
      {
        id: "4",
        name: "Summer Dress",
        category: "dresses",
        description: "Light summer dress perfect for warm weather",
        price: 45.99,
        sale_price: 34.99,
        colors: ["pink", "yellow", "white"],
        sizes: ["XS", "S", "M", "L"],
        tags: ["new", "seasonal"],
        rating: 4.6,
        created_at: "2024-01-04",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=Dress"
      },
      {
        id: "5",
        name: "Sports Shoes",
        category: "footwear",
        description: "Comfortable running shoes",
        price: 79.99,
        sale_price: null,
        colors: ["black", "white", "red"],
        sizes: ["6", "7", "8", "9", "10"],
        tags: ["popular"],
        rating: 4.8,
        created_at: "2024-01-05",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=Shoes"
      },
      {
        id: "6",
        name: "Winter Scarf",
        category: "accessories",
        description: "Warm wool scarf",
        price: 25.99,
        sale_price: 19.99,
        colors: ["red", "black", "gray"],
        sizes: ["one-size"],
        tags: ["sale"],
        rating: 4.4,
        created_at: "2024-01-06",
        featured: true,
        image: "https://via.placeholder.com/300x300?text=Scarf"
      }
    ];
    
    return {
      data: mockData
    };
  }
};

class ProductsPage {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.filters = {
      category: [],
      size: [],
      color: [],
      tag: [],
      priceMin: null,
      priceMax: null,
      search: "",
      sort: ""
    };

    this.init();
  }

  // INIT
  init() {
    this.loadURLParams();
    this.setupEventListeners();
    this.loadProducts();
  }

  loadURLParams() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("category")) {
      this.filters.category = [urlParams.get("category")];
    }
    if (urlParams.get("tag")) {
      this.filters.tag = [urlParams.get("tag")];
    }
    if (urlParams.get("search")) {
      this.filters.search = urlParams.get("search");
    }

    this.updatePageTitle();
  }

  setupEventListeners() {
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
      cb.addEventListener("change", (e) => this.handleFilterChange(e));
    });

    document.getElementById("applyPriceFilter")?.addEventListener("click", () => {
      this.filters.priceMin = parseFloat(document.getElementById("priceMin").value) || null;
      this.filters.priceMax = parseFloat(document.getElementById("priceMax").value) || null;
      this.applyFilters();
    });

    document.getElementById("sortSelect")?.addEventListener("change", (e) => {
      this.filters.sort = e.target.value;
      this.applyFilters();
    });

    document.getElementById("clearFilters")?.addEventListener("click", () => {
      this.clearAllFilters();
    });

    document.getElementById("mobileFiltersToggle")?.addEventListener("click", () => {
      this.openMobileFilters();
    });

    this.syncFiltersWithURL();
  }

  syncFiltersWithURL() {
    this.filters.category.forEach(cat => {
      const checkbox = document.querySelector(`input[name="category"][value="${cat}"]`);
      if (checkbox) checkbox.checked = true;
    });

    this.filters.tag.forEach(tag => {
      const checkbox = document.querySelector(`input[name="tag"][value="${tag}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }

  // LOAD PRODUCTS
  async loadProducts() {
    try {
      console.log("Fetching products from API...");
      const response = await API.fetchProducts();
      console.log("Products fetched:", response);
      this.products = response.data;
      console.log("Products set to:", this.products);
      this.applyFilters();
    } catch (err) {
      console.error("Error loading products:", err);
      this.renderEmptyState();
    }
  }

  // APPLY FILTERS
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Category
      if (this.filters.category.length > 0 && !this.filters.category.includes(product.category)) {
        return false;
      }

      // Size
      if (this.filters.size.length > 0) {
        const hasSize = this.filters.size.some(s => product.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Color
      if (this.filters.color.length > 0) {
        const hasColor = this.filters.color.some(c => product.colors.includes(c));
        if (!hasColor) return false;
      }

      // Tags
      if (this.filters.tag.length > 0) {
        const hasTag = this.filters.tag.some(t => product.tags.includes(t));
        if (!hasTag) return false;
      }

      // Price
      const price = product.sale_price || product.price;
      if (this.filters.priceMin !== null && price < this.filters.priceMin) return false;
      if (this.filters.priceMax !== null && price > this.filters.priceMax) return false;

      // Search
      if (this.filters.search) {
        const s = this.filters.search.toLowerCase();
        const match =
          product.name.toLowerCase().includes(s) ||
          product.category.toLowerCase().includes(s) ||
          product.description.toLowerCase().includes(s);
        if (!match) return false;
      }

      return true;
    });

    this.sortProducts();
    this.currentPage = 1;

    this.updateActiveFilters();
    this.renderProducts();
    this.renderPagination();
    this.updateResultsCount();
  }

  // SORTING
  sortProducts() {
    switch (this.filters.sort) {
      case "price-asc":
        this.filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case "price-desc":
        this.filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case "name-asc":
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        this.filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  // RENDER PRODUCTS
  renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    if (this.filteredProducts.length === 0) {
      this.renderEmptyState();
      return;
    }

    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    const pageProducts = this.filteredProducts.slice(start, end);

    grid.innerHTML = pageProducts.map(product => createProductCard(product)).join("");

    if (typeof Wishlist !== "undefined") Wishlist.updateUI();

    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  renderEmptyState() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.innerHTML = `
      <div class="products-empty" style="grid-column: 1 / -1;">
        <i class="fas fa-search"></i>
        <h3>No Products Found</h3>
        <p>Try adjusting your filters or search terms</p>
        <button class="btn btn-primary" onclick="productsPage.clearAllFilters()">
          Clear All Filters
        </button>
      </div>
    `;
  }

  // PAGINATION
  renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let html = `
      <button class="pagination-btn" onclick="productsPage.goToPage(${this.currentPage - 1})"
              ${this.currentPage === 1 ? "disabled" : ""}>
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    let maxVisiblePages = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (start > 1) html += `<button class="pagination-number" onclick="productsPage.goToPage(1)">1</button><span>...</span>`;
    for (let i = start; i <= end; i++) {
      html += `
        <button class="pagination-number ${i === this.currentPage ? "active" : ""}"
                onclick="productsPage.goToPage(${i})">
          ${i}
        </button>`;
    }
    if (end < totalPages) html += `<span>...</span><button class="pagination-number" onclick="productsPage.goToPage(${totalPages})">${totalPages}</button>`;

    html += `
      <button class="pagination-btn" onclick="productsPage.goToPage(${this.currentPage + 1})"
              ${this.currentPage === totalPages ? "disabled" : ""}>
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    pagination.innerHTML = html;
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (page < 1 || page > totalPages) return;

    this.currentPage = page;
    this.renderProducts();
    this.renderPagination();
  }

  // ACTIVE FILTER TAGS
  updateActiveFilters() {
    const container = document.getElementById("activeFilters");
    if (!container) return;

    const tags = [];

    this.filters.category.forEach(c => tags.push({ type: "category", value: c, label: c }));
    this.filters.size.forEach(s => tags.push({ type: "size", value: s, label: "Size: " + s }));
    this.filters.color.forEach(c => tags.push({ type: "color", value: c, label: "Color" }));
    this.filters.tag.forEach(t => tags.push({ type: "tag", value: t, label: t }));

    if (this.filters.priceMin !== null || this.filters.priceMax !== null) {
      tags.push({
        type: "price",
        value: "price",
        label: `$${this.filters.priceMin || 0} - $${this.filters.priceMax || "∞"}`
      });
    }

    if (this.filters.search) {
      tags.push({ type: "search", value: "search", label: `"${this.filters.search}"` });
    }

    container.innerHTML = tags.length === 0 ? "" :
      tags.map(t => `
        <div class="active-filter-tag">
          ${t.label}
          <button onclick="productsPage.removeFilter('${t.type}', '${t.value}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join("");
  }

  removeFilter(type, value) {
    if (type === "price") {
      this.filters.priceMin = null;
      this.filters.priceMax = null;
      document.getElementById("priceMin").value = "";
      document.getElementById("priceMax").value = "";
    } else if (type === "search") {
      this.filters.search = "";
    } else {
      this.filters[type] = this.filters[type].filter(v => v !== value);

      const cb = document.querySelector(`input[name="${type}"][value="${value}"]`);
      if (cb) cb.checked = false;
    }

    this.applyFilters();
  }

  clearAllFilters() {
    this.filters = {
      category: [],
      size: [],
      color: [],
      tag: [],
      priceMin: null,
      priceMax: null,
      search: "",
      sort: ""
    };

    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById("priceMin").value = "";
    document.getElementById("priceMax").value = "";
    document.getElementById("sortSelect").value = "";

    this.applyFilters();
  }

  updateResultsCount() {
    const el = document.getElementById("resultsCount");
    if (!el) return;

    const total = this.filteredProducts.length;
    el.textContent = `${total} ${total === 1 ? "product" : "products"} found`;
  }

  updatePageTitle() {
    const title = document.getElementById("pageTitle");
    const crumb = document.getElementById("breadcrumbCurrent");

    let pageTitle = "All Products";

    if (this.filters.category.length === 1) {
      pageTitle = this.filters.category[0];
    } else if (this.filters.tag.length === 1) {
      pageTitle = this.filters.tag[0];
    } else if (this.filters.search) {
      pageTitle = `Search: "${this.filters.search}"`;
    }

    if (title) title.textContent = pageTitle;
    if (crumb) crumb.textContent = pageTitle;
    document.title = `${pageTitle} - ZESTAAN`;
  }

  // Mobile filters
  openMobileFilters() {
    const sidebar = document.querySelector(".filters-sidebar");
    if (!sidebar) return;

    let mobileSidebar = document.querySelector(".filters-sidebar-mobile");

    if (!mobileSidebar) {
      mobileSidebar = document.createElement("div");
      mobileSidebar.className = "filters-sidebar-mobile";
      mobileSidebar.innerHTML = sidebar.innerHTML;
      document.body.appendChild(mobileSidebar);

      const closeBtn = document.createElement("button");
      closeBtn.className = "mobile-nav-close";
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = "position:absolute;top:1rem;right:1rem;font-size:1.5rem;background:none;border:none;cursor:pointer;";
      closeBtn.addEventListener("click", () => this.closeMobileFilters());

      mobileSidebar.prepend(closeBtn);

      const overlay = document.createElement("div");
      overlay.className = "filters-mobile-overlay";
      overlay.addEventListener("click", () => this.closeMobileFilters());
      document.body.appendChild(overlay);

      mobileSidebar.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
        cb.addEventListener("change", (e) => this.handleFilterChange(e));
      });

      mobileSidebar.querySelector("#applyPriceFilter")?.addEventListener("click", () => {
        this.filters.priceMin = parseFloat(mobileSidebar.querySelector("#priceMin").value) || null;
        this.filters.priceMax = parseFloat(mobileSidebar.querySelector("#priceMax").value) || null;
        this.applyFilters();
        this.closeMobileFilters();
      });

      mobileSidebar.querySelector("#clearFilters")?.addEventListener("click", () => {
        this.clearAllFilters();
        this.closeMobileFilters();
      });
    }

    mobileSidebar.classList.add("active");
    document.querySelector(".filters-mobile-overlay")?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileFilters() {
    document.querySelector(".filters-sidebar-mobile")?.classList.remove("active");
    document.querySelector(".filters-mobile-overlay")?.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Initialize
let productsPage;
document.addEventListener("DOMContentLoaded", () => {
  productsPage = new ProductsPage();
  window.productsPage = productsPage;
});
