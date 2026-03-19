// ZESTAAN - Wishlist Manager

const Wishlist = {
  items: [],
  
  init() {
    this.items = Storage.get('wishlist') || [];
    this.updateUI();
  },
  
  async toggle(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    
    if (index > -1) {
      // Remove from wishlist
      this.items.splice(index, 1);
      this.save();
      this.updateUI();
      Utils.showNotification('Removed from wishlist', 'success');
    } else {
      // Add to wishlist
      try {
        const product = await API.fetchProduct(productId);
        if (!product) {
          Utils.showNotification('Product not found', 'error');
          return;
        }
        
        this.items.push({
          id: productId,
          name: product.name,
          price: product.sale_price || product.price,
          originalPrice: product.price,
          image: product.images?.[0] || '',
          category: product.category,
          rating: product.rating,
          review_count: product.review_count
        });
        
        this.save();
        this.updateUI();
        Utils.showNotification(`${product.name} added to wishlist!`, 'success');
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        Utils.showNotification('Failed to add to wishlist', 'error');
      }
    }
  },
  
  isInWishlist(productId) {
    return this.items.some(item => item.id === productId);
  },
  
  remove(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      const item = this.items[index];
      this.items.splice(index, 1);
      this.save();
      this.updateUI();
      Utils.showNotification(`${item.name} removed from wishlist`, 'success');
    }
  },
  
  clear() {
    this.items = [];
    this.save();
    this.updateUI();
  },
  
  save() {
    Storage.set('wishlist', this.items);
    if (typeof updateBadges === 'function') {
      updateBadges();
    }
  },
  
  updateUI() {
    // Update wishlist icons
    const wishlistIcons = document.querySelectorAll('.product-wishlist');
    wishlistIcons.forEach(icon => {
      const productId = icon.closest('[data-id]')?.dataset.id;
      if (productId && this.isInWishlist(productId)) {
        icon.classList.add('active');
        icon.querySelector('i').classList.remove('far');
        icon.querySelector('i').classList.add('fas');
      } else {
        icon.classList.remove('active');
        icon.querySelector('i').classList.remove('fas');
        icon.querySelector('i').classList.add('far');
      }
    });
    
    // Update wishlist page if we're on it
    if (window.location.pathname.includes('wishlist.html')) {
      this.renderWishlistPage();
    }
    
    // Update badges
    if (typeof updateBadges === 'function') {
      updateBadges();
    }
  },
  
  renderWishlistPage() {
    const wishlistContainer = document.getElementById('wishlistItems');
    const wishlistEmpty = document.getElementById('wishlistEmpty');
    
    if (!wishlistContainer) return;
    
    if (this.items.length === 0) {
      if (wishlistEmpty) wishlistEmpty.style.display = 'block';
      wishlistContainer.innerHTML = '';
      return;
    }
    
    if (wishlistEmpty) wishlistEmpty.style.display = 'none';
    
    wishlistContainer.innerHTML = `
      <div class="product-grid">
        ${this.items.map(item => {
          const isOnSale = item.originalPrice > item.price;
          return `
            <div class="product-card" data-id="${item.id}">
              <div class="product-image-wrapper">
                <img src="${item.image || 'https://via.placeholder.com/400x600'}" 
                     alt="${item.name}" 
                     class="product-image">
                ${isOnSale ? '<div class="product-badge sale">SALE</div>' : ''}
                <button class="product-wishlist active" onclick="Wishlist.remove('${item.id}')">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
              <div class="product-info">
                <div class="product-category">${item.category || 'Fashion'}</div>
                <h3 class="product-name">
                  <a href="product-detail.html?id=${item.id}">${item.name}</a>
                </h3>
                ${item.rating ? `
                  <div class="product-rating">
                    <span class="stars">${Utils.generateStars(item.rating)}</span>
                    <span class="review-count">(${item.review_count || 0})</span>
                  </div>
                ` : ''}
                <div class="product-price">
                  <span class="${isOnSale ? 'price-sale' : ''}">${Utils.formatPrice(item.price)}</span>
                  ${isOnSale ? `<span class="price-original">${Utils.formatPrice(item.originalPrice)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-full mt-2" onclick="Cart.addItem('${item.id}')">
                  Add to Cart
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },
  
  async moveAllToCart() {
    for (const item of this.items) {
      await Cart.addItem(item.id);
    }
    this.clear();
    Utils.showNotification('All items moved to cart!', 'success');
  }
};

// Initialize wishlist when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Wishlist.init());
} else {
  Wishlist.init();
}

// Make Wishlist globally available
window.Wishlist = Wishlist;
