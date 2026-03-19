// ZESTAAN - Main JavaScript

// ==================== GLOBAL STATE ====================
const APP_STATE = {
  cart: [],
  wishlist: [],
  user: null,
  filters: {},
  searchQuery: ''
};

// ==================== LOCAL STORAGE ====================
const Storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// ==================== HEADER FUNCTIONALITY ====================
class Header {
  constructor() {
    this.header = document.getElementById('header');
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.mobileNav = document.getElementById('mobileNav');
    this.mobileNavClose = document.getElementById('mobileNavClose');
    this.mobileNavOverlay = document.getElementById('mobileNavOverlay');
    
    this.init();
  }
  
  init() {
    // Sticky header on scroll
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Mobile menu
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.openMobileMenu());
    }
    
    if (this.mobileNavClose) {
      this.mobileNavClose.addEventListener('click', () => this.closeMobileMenu());
    }
    
    if (this.mobileNavOverlay) {
      this.mobileNavOverlay.addEventListener('click', () => this.closeMobileMenu());
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch(searchInput.value);
        }
      });
    }
  }
  
  handleScroll() {
    if (window.scrollY > 100) {
      this.header?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
    }
  }
  
  openMobileMenu() {
    this.mobileNav?.classList.add('active');
    this.mobileNavOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeMobileMenu() {
    this.mobileNav?.classList.remove('active');
    this.mobileNavOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleSearch(query) {
    if (query.trim()) {
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
  }
}

// ==================== API HELPER ====================
const API = {
  async fetchProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`tables/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], total: 0 };
    }
  },
  
  async fetchProduct(id) {
    try {
      const response = await fetch(`tables/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  
  async createOrder(orderData) {
    try {
      const response = await fetch('tables/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  async fetchOrders(email) {
    try {
      const response = await fetch(`tables/orders?search=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: [] };
    }
  },
  
  async fetchReviews(productId) {
    try {
      const response = await fetch(`tables/reviews?search=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: [] };
    }
  },
  
  async createReview(reviewData) {
    try {
      const response = await fetch('tables/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error('Failed to create review');
      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  
  async validateCoupon(code) {
    try {
      const response = await fetch(`tables/coupons?search=${encodeURIComponent(code)}`);
      if (!response.ok) throw new Error('Failed to validate coupon');
      const result = await response.json();
      return result.data.find(c => c.code === code && c.active);
    } catch (error) {
      console.error('Error validating coupon:', error);
      return null;
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
  formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
  },
  
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  },
  
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#000' : '#dc2626'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
  
  debounce(func, wait) {
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
  
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },
  
  scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
};

// ==================== PRODUCT CARD GENERATOR ====================
function createProductCard(product) {
  const isOnSale = product.sale_price && product.sale_price < product.price;
  const displayPrice = isOnSale ? product.sale_price : product.price;
  const badge = product.tags?.includes('new') ? 'NEW' : 
                product.tags?.includes('exclusive') ? 'EXCLUSIVE' :
                product.tags?.includes('limited') ? 'LIMITED' :
                isOnSale ? 'SALE' : '';
  
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrapper">
        <img src="${product.images?.[0] || 'https://via.placeholder.com/400x600?text=Product'}" 
             alt="${product.name}" 
             class="product-image"
             loading="lazy">
        ${badge ? `<div class="product-badge ${isOnSale ? 'sale' : ''}">${badge}</div>` : ''}
        <button class="product-wishlist" onclick="toggleWishlist('${product.id}', event)">
          <i class="far fa-heart"></i>
        </button>
        <button class="product-quick-add btn btn-primary btn-sm btn-full" 
                onclick="quickAddToCart('${product.id}', event)">
          Quick Add
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category || 'Fashion'}</div>
        <h3 class="product-name">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h3>
        ${product.rating ? `
          <div class="product-rating">
            <span class="stars">${Utils.generateStars(product.rating)}</span>
            <span class="review-count">(${product.review_count || 0})</span>
          </div>
        ` : ''}
        <div class="product-price">
          <span class="${isOnSale ? 'price-sale' : ''}">${Utils.formatPrice(displayPrice)}</span>
          ${isOnSale ? `<span class="price-original">${Utils.formatPrice(product.price)}</span>` : ''}
        </div>
        ${product.colors?.length ? `
          <div class="product-colors">
            ${product.colors.slice(0, 4).map(color => `
              <div class="color-swatch" style="background-color: ${color}" title="${color}"></div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ==================== QUICK ADD TO CART ====================
function quickAddToCart(productId, event) {
  event?.stopPropagation();
  
  // Get cart from cart.js
  if (typeof Cart !== 'undefined') {
    Cart.addItem(productId);
  } else {
    Utils.showNotification('Added to cart!', 'success');
  }
}

// ==================== TOGGLE WISHLIST ====================
function toggleWishlist(productId, event) {
  event?.stopPropagation();
  
  // Get wishlist from wishlist.js
  if (typeof Wishlist !== 'undefined') {
    Wishlist.toggle(productId);
  } else {
    Utils.showNotification('Added to wishlist!', 'success');
  }
}

// ==================== LAZY LOADING ====================
class LazyLoader {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              this.observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      this.observeImages();
    }
  }
  
  observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => this.observer?.observe(img));
  }
  
  refresh() {
    this.observeImages();
  }
}

// ==================== ANIMATION STYLES ====================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize header
  new Header();
  
  // Initialize lazy loading
  new LazyLoader();
  
  // Update cart and wishlist badges
  updateBadges();
});

// ==================== UPDATE BADGES ====================
function updateBadges() {
  const cart = Storage.get('cart') || [];
  const wishlist = Storage.get('wishlist') || [];
  
  const cartCount = document.getElementById('cartCount');
  const wishlistCount = document.getElementById('wishlistCount');
  
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
  
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
    wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
  }
}

// Make functions globally available
window.API = API;
window.Utils = Utils;
window.Storage = Storage;
window.createProductCard = createProductCard;
window.quickAddToCart = quickAddToCart;
window.toggleWishlist = toggleWishlist;
window.updateBadges = updateBadges;
