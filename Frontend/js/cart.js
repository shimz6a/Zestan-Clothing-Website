// ZESTAAN - Shopping Cart Manager

const Cart = {
  items: [],
  
  init() {
    this.items = Storage.get('cart') || [];
    this.updateUI();
  },
  
  async addItem(productId, quantity = 1, selectedSize = null, selectedColor = null) {
    try {
      // Fetch product details
      const product = await API.fetchProduct(productId);
      if (!product) {
        Utils.showNotification('Product not found', 'error');
        return;
      }
      
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(item => 
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      
      if (existingItemIndex > -1) {
        // Update quantity
        this.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        this.items.push({
          id: productId,
          name: product.name,
          price: product.sale_price || product.price,
          originalPrice: product.price,
          image: product.images?.[0] || '',
          category: product.category,
          selectedSize: selectedSize || product.sizes?.[0],
          selectedColor: selectedColor || product.colors?.[0],
          quantity: quantity,
          stock: product.stock
        });
      }
      
      this.save();
      this.updateUI();
      Utils.showNotification(`${product.name} added to cart!`, 'success');
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Utils.showNotification('Failed to add item to cart', 'error');
    }
  },
  
  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      this.items.splice(index, 1);
      this.save();
      this.updateUI();
      Utils.showNotification(`${item.name} removed from cart`, 'success');
    }
  },
  
  updateQuantity(index, quantity) {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      
      // Check stock availability
      if (quantity > item.stock) {
        Utils.showNotification(`Only ${item.stock} items available`, 'error');
        return;
      }
      
      if (quantity < 1) {
        this.removeItem(index);
        return;
      }
      
      this.items[index].quantity = quantity;
      this.save();
      this.updateUI();
    }
  },
  
  updateSize(index, size) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].selectedSize = size;
      this.save();
      this.updateUI();
    }
  },
  
  updateColor(index, color) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].selectedColor = color;
      this.save();
      this.updateUI();
    }
  },
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  clear() {
    this.items = [];
    this.save();
    this.updateUI();
  },
  
  save() {
    Storage.set('cart', this.items);
    if (typeof updateBadges === 'function') {
      updateBadges();
    }
  },
  
  updateUI() {
    // Update cart count badge
    if (typeof updateBadges === 'function') {
      updateBadges();
    }
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
      this.renderCartPage();
    }
  },
  
  renderCartPage() {
    const cartContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    if (this.items.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartSummary) cartSummary.style.display = 'none';
      cartContainer.innerHTML = '';
      return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartContainer.innerHTML = this.items.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-image">
          <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="cart-item-category">${item.category}</p>
          <div class="cart-item-variants">
            ${item.selectedSize ? `<span>Size: ${item.selectedSize}</span>` : ''}
            ${item.selectedColor ? `<span>Color: ${item.selectedColor}</span>` : ''}
          </div>
        </div>
        <div class="cart-item-price">
          ${Utils.formatPrice(item.price)}
          ${item.originalPrice > item.price ? `<span class="original-price">${Utils.formatPrice(item.originalPrice)}</span>` : ''}
        </div>
        <div class="cart-item-quantity">
          <button onclick="Cart.updateQuantity(${index}, ${item.quantity - 1})" class="qty-btn">-</button>
          <input type="number" value="${item.quantity}" min="1" max="${item.stock}" 
                 onchange="Cart.updateQuantity(${index}, parseInt(this.value))">
          <button onclick="Cart.updateQuantity(${index}, ${item.quantity + 1})" class="qty-btn">+</button>
        </div>
        <div class="cart-item-total">
          ${Utils.formatPrice(item.price * item.quantity)}
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
    
    // Update summary
    const subtotal = this.getTotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = Utils.formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : Utils.formatPrice(shipping);
    if (taxEl) taxEl.textContent = Utils.formatPrice(tax);
    if (totalEl) totalEl.textContent = Utils.formatPrice(total);
  },
  
  async applyCoupon(code) {
    const coupon = await API.validateCoupon(code);
    
    if (!coupon) {
      Utils.showNotification('Invalid or expired coupon code', 'error');
      return null;
    }
    
    const subtotal = this.getTotal();
    
    if (coupon.min_purchase && subtotal < coupon.min_purchase) {
      Utils.showNotification(`Minimum purchase of ${Utils.formatPrice(coupon.min_purchase)} required`, 'error');
      return null;
    }
    
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = subtotal * (coupon.discount_value / 100);
    } else {
      discount = coupon.discount_value;
    }
    
    Utils.showNotification(`Coupon applied! You saved ${Utils.formatPrice(discount)}`, 'success');
    return { coupon, discount };
  }
};

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Cart.init());
} else {
  Cart.init();
}

// Make Cart globally available
window.Cart = Cart;
