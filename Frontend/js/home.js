// ZESTAAN - Homepage JavaScript

// ==================== HERO CAROUSEL ====================
class HeroCarousel {
  constructor() {
    this.carousel = document.getElementById('heroCarousel');
    this.slides = document.querySelectorAll('.hero-slide');
    this.prevBtn = document.getElementById('heroPrev');
    this.nextBtn = document.getElementById('heroNext');
    this.indicators = document.getElementById('heroIndicators');
    this.currentSlide = 0;
    this.autoplayInterval = null;
    
    if (this.carousel && this.slides.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Create indicators
    this.createIndicators();
    
    // Event listeners
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    
    // Auto play
    this.startAutoplay();
    
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
  }
  
  createIndicators() {
    if (!this.indicators) return;
    
    this.indicators.innerHTML = '';
    this.slides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicators.appendChild(indicator);
    });
  }
  
  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove('active');
    this.slides[this.currentSlide].style.display = 'none';
    
    this.currentSlide = index;
    
    this.slides[this.currentSlide].classList.add('active');
    this.slides[this.currentSlide].style.display = 'block';
    
    // Update indicators
    const indicators = this.indicators?.querySelectorAll('.hero-indicator');
    indicators?.forEach((ind, i) => {
      ind.classList.toggle('active', i === this.currentSlide);
    });
  }
  
  next() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prev() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 5000);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// ==================== LOAD PRODUCTS ====================
async function loadHomepageProducts() {
  try {
    // Load New Arrivals
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid) {
      const newArrivals = await API.fetchProducts({ limit: 4, sort: '-created_at' });
      if (newArrivals.data.length > 0) {
        newArrivalsGrid.innerHTML = newArrivals.data.map(product => createProductCard(product)).join('');
      } else {
        newArrivalsGrid.innerHTML = '<p class="text-center">No products available yet.</p>';
      }
    }
    
    // Load Best Sellers
    const bestSellersGrid = document.getElementById('bestSellersGrid');
    if (bestSellersGrid) {
      const bestSellers = await API.fetchProducts({ limit: 4, sort: '-rating' });
      if (bestSellers.data.length > 0) {
        bestSellersGrid.innerHTML = bestSellers.data.map(product => createProductCard(product)).join('');
      } else {
        bestSellersGrid.innerHTML = '<p class="text-center">No products available yet.</p>';
      }
    }
    
    // Load Seasonal Collection
    const seasonalGrid = document.getElementById('seasonalGrid');
    if (seasonalGrid) {
      const seasonal = await API.fetchProducts({ limit: 4 });
      if (seasonal.data.length > 0) {
        seasonalGrid.innerHTML = seasonal.data.map(product => createProductCard(product)).join('');
      } else {
        seasonalGrid.innerHTML = '<p class="text-center">No products available yet.</p>';
      }
    }
    
    // Update wishlist UI after products are loaded
    if (typeof Wishlist !== 'undefined') {
      Wishlist.updateUI();
    }
    
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// ==================== NEWSLETTER FORM ====================
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.querySelector('input[type="email"]').value;
      
      if (email) {
        // Here you would typically send to backend
        Utils.showNotification('Thank you for subscribing!', 'success');
        form.reset();
      }
    });
  }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize hero carousel
  new HeroCarousel();
  
  // Load products
  loadHomepageProducts();
  
  // Initialize newsletter
  initNewsletter();
  
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections
  document.querySelectorAll('.collection-section, .category-showcase, .features-section').forEach(section => {
    observer.observe(section);
  });
});
