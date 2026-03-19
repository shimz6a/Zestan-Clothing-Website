// ZESTAAN - Products Page JavaScript

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
      search: '',
      sort: ''
    };
    
    this.init();
  }
  
  init() {
    this.loadURLParams();
    this.setupEventListeners();
    this.loadProducts();
  }
  
  loadURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Load category from URL
    if (urlParams.get('category')) {
      this.filters.category = [urlParams.get('category')];
    }
    
    // Load subcategory from URL
    if (urlParams.get('sub')) {
      // This would filter by subcategory if needed
    }
    
    // Load tag from URL
    if (urlParams.get('tag')) {
      this.filters.tag = [urlParams.get('tag')];
    }
    
    // Load search from URL
    if (urlParams.get('search')) {
      this.filters.search = urlParams.get('search');
    }
    
    // Update page title
    this.updatePageTitle();
  }
  
  setupEventListeners() {
    // Filter checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => this.handleFilterChange(e));
    });
    
    // Price filter
    document.getElementById('applyPriceFilter')?.addEventListener('click', () => {
      this.filters.priceMin = parseFloat(document.getElementById('priceMin').value) || null;
      this.filters.priceMax = parseFloat(document.getElementById('priceMax').value) || null;
      this.applyFilters();
    });
    
    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
      this.filters.sort = e.target.value;
      this.applyFilters();
    });
    
    // Clear filters
    document.getElementById('clearFilters')?.addEventListener('click', () => {
      this.clearAllFilters();
    });
    
    // Mobile filters toggle
    document.getElementById('mobileFiltersToggle')?.addEventListener('click', () => {
      this.openMobileFilters();
    });
    
    // Sync filter checkboxes with URL params
    this.syncFiltersWithURL();
  }
  
  syncFiltersWithURL() {
    // Check category checkboxes
    this.filters.category.forEach(cat => {
      const checkbox = document.querySelector(`input[name="category"][value="${cat}"]`);
      if (checkbox) checkbox.checked = true;
    });
    
    // Check tag checkboxes
    this.filters.tag.forEach(tag => {
      const checkbox = document.querySelector(`input[name="tag"][value="${tag}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }
  
  handleFilterChange(e) {
    const { name, value, checked } = e.target;
    
    if (checked) {
      if (!this.filters[name].includes(value)) {
        this.filters[name].push(value);
      }
    } else {
      this.filters[name] = this.filters[name].filter(v => v !== value);
    }
    
    this.applyFilters();
  }
  
  async loadProducts() {
    try {
      const response = await API.fetchProducts({ limit: 100 });
      this.products = response.data;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading products:', error);
      this.renderEmptyState();
    }
  }
  
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.filters.category.length > 0) {
        if (!this.filters.category.includes(product.category)) return false;
      }
      
      // Size filter
      if (this.filters.size.length > 0) {
        const hasSize = this.filters.size.some(size => 
          product.sizes?.includes(size)
        );
        if (!hasSize) return false;
      }
      
      // Color filter
      if (this.filters.color.length > 0) {
        const hasColor = this.filters.color.some(color => 
          product.colors?.includes(color)
        );
        if (!hasColor) return false;
      }
      
      // Tag filter
      if (this.filters.tag.length > 0) {
        const hasTag = this.filters.tag.some(tag => 
          product.tags?.includes(tag)
        );
        if (!hasTag) return false;
      }
      
      // Price filter
      const price = product.sale_price || product.price;
      if (this.filters.priceMin !== null && price < this.filters.priceMin) return false;
      if (this.filters.priceMax !== null && price > this.filters.priceMax) return false;
      
      // Search filter
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const categoryMatch = product.category?.toLowerCase().includes(searchLower);
        const descMatch = product.description?.toLowerCase().includes(searchLower);
        if (!nameMatch && !categoryMatch && !descMatch) return false;
      }
      
      return true;
    });
    
    // Apply sorting
    this.sortProducts();
    
    // Reset to page 1
    this.currentPage = 1;
    
    // Update UI
    this.updateActiveFilters();
    this.renderProducts();
    this.renderPagination();
    this.updateResultsCount();
  }
  
  sortProducts() {
    switch (this.filters.sort) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => {
          const priceA = a.sale_price || a.price;
          const priceB = b.sale_price || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => {
          const priceA = a.sale_price || a.price;
          const priceB = b.sale_price || b.price;
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        });
        break;
      default:
        // Featured sorting (featured items first, then by rating)
        this.filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }
  
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (this.filteredProducts.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    const pageProducts = this.filteredProducts.slice(start, end);
    
    grid.innerHTML = pageProducts.map(product => createProductCard(product)).join('');
    
    // Update wishlist UI
    if (typeof Wishlist !== 'undefined') {
      Wishlist.updateUI();
    }
    
    // Scroll to top of products
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
  
  renderEmptyState() {
    const grid = document.getElementById('productsGrid');
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
  
  renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = `
      <button class="pagination-btn" onclick="productsPage.goToPage(${this.currentPage - 1})" 
              ${this.currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
      </button>
    `;
    
    // Show page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      paginationHTML += `
        <button class="pagination-number" onclick="productsPage.goToPage(1)">1</button>
      `;
      if (startPage > 2) {
        paginationHTML += `<span>...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                onclick="productsPage.goToPage(${i})">
          ${i}
        </button>
      `;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span>...</span>`;
      }
      paginationHTML += `
        <button class="pagination-number" onclick="productsPage.goToPage(${totalPages})">
          ${totalPages}
        </button>
      `;
    }
    
    paginationHTML += `
      <button class="pagination-btn" onclick="productsPage.goToPage(${this.currentPage + 1})" 
              ${this.currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    pagination.innerHTML = paginationHTML;
  }
  
  goToPage(page) {
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.renderProducts();
    this.renderPagination();
  }
  
  updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    const tags = [];
    
    // Category tags
    this.filters.category.forEach(cat => {
      tags.push({ type: 'category', value: cat, label: cat });
    });
    
    // Size tags
    this.filters.size.forEach(size => {
      tags.push({ type: 'size', value: size, label: `Size: ${size}` });
    });
    
    // Color tags
    this.filters.color.forEach(color => {
      tags.push({ type: 'color', value: color, label: 'Color' });
    });
    
    // Tag tags
    this.filters.tag.forEach(tag => {
      const label = tag.charAt(0).toUpperCase() + tag.slice(1);
      tags.push({ type: 'tag', value: tag, label });
    });
    
    // Price tag
    if (this.filters.priceMin !== null || this.filters.priceMax !== null) {
      const min = this.filters.priceMin || 0;
      const max = this.filters.priceMax || '∞';
      tags.push({ type: 'price', value: 'price', label: `$${min} - $${max}` });
    }
    
    // Search tag
    if (this.filters.search) {
      tags.push({ type: 'search', value: 'search', label: `"${this.filters.search}"` });
    }
    
    if (tags.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = tags.map(tag => `
      <div class="active-filter-tag">
        ${tag.label}
        <button onclick="productsPage.removeFilter('${tag.type}', '${tag.value}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
  
  removeFilter(type, value) {
    if (type === 'price') {
      this.filters.priceMin = null;
      this.filters.priceMax = null;
      document.getElementById('priceMin').value = '';
      document.getElementById('priceMax').value = '';
    } else if (type === 'search') {
      this.filters.search = '';
    } else {
      this.filters[type] = this.filters[type].filter(v => v !== value);
      
      // Uncheck the checkbox
      const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
      if (checkbox) checkbox.checked = false;
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
      search: '',
      sort: ''
    };
    
    // Clear all checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    
    // Clear price inputs
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    
    // Clear sort
    document.getElementById('sortSelect').value = '';
    
    this.applyFilters();
  }
  
  updateResultsCount() {
    const counter = document.getElementById('resultsCount');
    if (!counter) return;
    
    const total = this.filteredProducts.length;
    counter.textContent = `${total} ${total === 1 ? 'product' : 'products'} found`;
  }
  
  updatePageTitle() {
    const title = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumbCurrent');
    
    let pageTitle = 'All Products';
    
    if (this.filters.category.length === 1) {
      pageTitle = this.filters.category[0];
    } else if (this.filters.tag.length === 1) {
      const tag = this.filters.tag[0];
      pageTitle = tag === 'new' ? 'New Arrivals' :
                  tag === 'bestseller' ? 'Best Sellers' :
                  tag === 'exclusive' ? 'Exclusive Collection' :
                  tag === 'limited' ? 'Limited Edition' :
                  tag === 'seasonal' ? 'Seasonal Collection' :
                  tag.charAt(0).toUpperCase() + tag.slice(1);
    } else if (this.filters.search) {
      pageTitle = `Search: "${this.filters.search}"`;
    }
    
    if (title) title.textContent = pageTitle;
    if (breadcrumb) breadcrumb.textContent = pageTitle;
    document.title = `${pageTitle} - ZESTAAN`;
  }
  
  openMobileFilters() {
    // Clone sidebar filters to mobile
    const sidebar = document.querySelector('.filters-sidebar');
    if (!sidebar) return;
    
    let mobileSidebar = document.querySelector('.filters-sidebar-mobile');
    if (!mobileSidebar) {
      mobileSidebar = document.createElement('div');
      mobileSidebar.className = 'filters-sidebar-mobile';
      mobileSidebar.innerHTML = sidebar.innerHTML;
      document.body.appendChild(mobileSidebar);
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-nav-close';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = 'position: absolute; top: 1rem; right: 1rem; font-size: 1.5rem; background: none; border: none; cursor: pointer;';
      closeBtn.addEventListener('click', () => this.closeMobileFilters());
      mobileSidebar.prepend(closeBtn);
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'filters-mobile-overlay';
      overlay.addEventListener('click', () => this.closeMobileFilters());
      document.body.appendChild(overlay);
      
      // Re-attach event listeners
      mobileSidebar.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => this.handleFilterChange(e));
      });
      
      mobileSidebar.querySelector('#applyPriceFilter')?.addEventListener('click', () => {
        this.filters.priceMin = parseFloat(mobileSidebar.querySelector('#priceMin').value) || null;
        this.filters.priceMax = parseFloat(mobileSidebar.querySelector('#priceMax').value) || null;
        this.applyFilters();
        this.closeMobileFilters();
      });
      
      mobileSidebar.querySelector('#clearFilters')?.addEventListener('click', () => {
        this.clearAllFilters();
        this.closeMobileFilters();
      });
    }
    
    mobileSidebar.classList.add('active');
    document.querySelector('.filters-mobile-overlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeMobileFilters() {
    document.querySelector('.filters-sidebar-mobile')?.classList.remove('active');
    document.querySelector('.filters-mobile-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize products page
let productsPage;
document.addEventListener('DOMContentLoaded', () => {
  productsPage = new ProductsPage();
});

// Make globally available
window.productsPage = productsPage;
