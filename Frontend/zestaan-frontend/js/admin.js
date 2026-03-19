// ZESTAAN Admin Dashboard JavaScript

class AdminDashboard {
  constructor() {
    this.products = [];
    this.orders = [];
    this.coupons = [];
    this.currentSection = 'dashboard';
    
    this.init();
  }
  
  init() {
    this.setupNavigation();
    this.loadAllData();
  }
  
  setupNavigation() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });
  }
  
  switchSection(sectionName) {
    // Update nav
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionName)?.classList.add('active');
    
    this.currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'products':
        this.loadProductsTable();
        break;
      case 'orders':
        this.loadOrdersTable();
        break;
      case 'inventory':
        this.loadInventoryTable();
        break;
      case 'coupons':
        this.loadCouponsTable();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
    }
  }
  
  async loadAllData() {
    try {
      // Load products
      const productsRes = await API.fetchProducts({ limit: 100 });
      this.products = productsRes.data;
      
      // Load orders
      const ordersRes = await fetch('tables/orders?limit=100');
      const ordersData = await ordersRes.json();
      this.orders = ordersData.data || [];
      
      // Load coupons
      const couponsRes = await fetch('tables/coupons');
      const couponsData = await couponsRes.json();
      this.coupons = couponsData.data || [];
      
      // Load initial dashboard
      this.loadDashboard();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  async loadDashboard() {
    // Calculate stats
    const totalRevenue = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = this.orders.length;
    const totalProducts = this.products.length;
    const uniqueCustomers = new Set(this.orders.map(o => o.user_email)).size;
    
    // Update stats
    document.getElementById('totalRevenue').textContent = Utils.formatPrice(totalRevenue);
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalCustomers').textContent = uniqueCustomers;
    
    // Load charts
    this.loadSalesChart();
    this.loadCategoryChart();
    
    // Load recent orders
    this.loadRecentOrders();
  }
  
  loadSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Mock data for demonstration
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [1200, 1900, 1500, 2100, 2400, 2800, 3200];
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales ($)',
          data: data,
          borderColor: '#000000',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  }
  
  loadCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Calculate category distribution
    const categories = {};
    this.products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          data: Object.values(categories),
          backgroundColor: [
            '#000000',
            '#757575',
            '#C9A962',
            '#d1d1d1'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  loadRecentOrders() {
    const container = document.getElementById('recentOrdersList');
    if (!container) return;
    
    const recentOrders = this.orders.slice(0, 5);
    
    if (recentOrders.length === 0) {
      container.innerHTML = '<p>No orders yet.</p>';
      return;
    }
    
    container.innerHTML = recentOrders.map(order => `
      <div class="order-item">
        <div>
          <strong>#${order.id.slice(0, 8)}</strong><br>
          <small>${order.user_name}</small>
        </div>
        <div>
          ${Utils.formatPrice(order.total)}
        </div>
        <div>
          <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
        </div>
      </div>
    `).join('');
  }
  
  loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (this.products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No products found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = this.products.map(product => `
      <tr>
        <td>
          <div class="product-cell">
            <img src="${product.images?.[0] || 'https://via.placeholder.com/50'}" alt="${product.name}">
            <span>${product.name}</span>
          </div>
        </td>
        <td>${product.category}</td>
        <td>${Utils.formatPrice(product.price)}</td>
        <td>${product.stock}</td>
        <td>
          <span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="editProduct('${product.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" onclick="deleteProduct('${product.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    if (this.orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No orders found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = this.orders.map(order => `
      <tr>
        <td>#${order.id.slice(0, 8)}</td>
        <td>${order.user_name}<br><small>${order.user_email}</small></td>
        <td>${Utils.formatDate(order.order_date || order.created_at)}</td>
        <td>${Utils.formatPrice(order.total)}</td>
        <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="viewOrder('${order.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn" onclick="updateOrderStatus('${order.id}')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  loadInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    // Calculate inventory stats
    const lowStock = this.products.filter(p => p.stock > 0 && p.stock < 20).length;
    const outOfStock = this.products.filter(p => p.stock === 0).length;
    
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('outOfStockCount').textContent = outOfStock;
    
    tbody.innerHTML = this.products.map(product => {
      const status = product.stock === 0 ? 'out-of-stock' : 
                     product.stock < 20 ? 'low-stock' : 'active';
      const statusText = product.stock === 0 ? 'Out of Stock' : 
                         product.stock < 20 ? 'Low Stock' : 'In Stock';
      
      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.id.slice(0, 10)}</td>
          <td>${product.stock}</td>
          <td><span class="status-badge ${status}">${statusText}</span></td>
          <td>
            <button class="action-btn" onclick="updateStock('${product.id}')">
              <i class="fas fa-boxes"></i> Update Stock
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  loadCouponsTable() {
    const tbody = document.getElementById('couponsTableBody');
    if (!tbody) return;
    
    if (this.coupons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No coupons found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = this.coupons.map(coupon => `
      <tr>
        <td><strong>${coupon.code}</strong></td>
        <td>
          ${coupon.discount_type === 'percentage' ? 
            `${coupon.discount_value}%` : 
            Utils.formatPrice(coupon.discount_value)}
        </td>
        <td>${coupon.min_purchase ? Utils.formatPrice(coupon.min_purchase) : 'None'}</td>
        <td>${Utils.formatDate(coupon.expiry_date)}</td>
        <td>
          <span class="status-badge ${coupon.active ? 'active' : 'inactive'}">
            ${coupon.active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn" onclick="editCoupon('${coupon.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" onclick="deleteCoupon('${coupon.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  loadAnalytics() {
    // Calculate conversion rate (mock data)
    const conversionRate = ((this.orders.length / (this.orders.length * 10)) * 100).toFixed(1);
    document.getElementById('conversionRate').textContent = conversionRate + '%';
    
    // Calculate average order value
    const avgOrderValue = this.orders.length > 0 ?
      this.orders.reduce((sum, o) => sum + o.total, 0) / this.orders.length : 0;
    document.getElementById('avgOrderValue').textContent = Utils.formatPrice(avgOrderValue);
    
    // Mock retention rate
    document.getElementById('customerRetention').textContent = '68%';
    
    // Load traffic chart
    this.loadTrafficChart();
  }
  
  loadTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;
    
    // Mock data
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Website Traffic',
            data: [5200, 6800, 7200, 8500],
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: '#000000',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Sales',
            data: [1200, 1800, 2100, 2700],
            backgroundColor: 'rgba(201, 169, 98, 0.6)',
            borderColor: '#C9A962',
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Traffic'
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Sales ($)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
  window.adminDashboard = new AdminDashboard();
});

// Placeholder functions for actions
function editProduct(id) {
  Utils.showNotification('Edit product functionality coming soon!', 'success');
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    Utils.showNotification('Product deleted successfully!', 'success');
  }
}

function viewOrder(id) {
  Utils.showNotification('View order details coming soon!', 'success');
}

function updateOrderStatus(id) {
  Utils.showNotification('Update order status coming soon!', 'success');
}

function updateStock(id) {
  const newStock = prompt('Enter new stock quantity:');
  if (newStock !== null) {
    Utils.showNotification(`Stock updated to ${newStock}!`, 'success');
  }
}

function editCoupon(id) {
  Utils.showNotification('Edit coupon functionality coming soon!', 'success');
}

function deleteCoupon(id) {
  if (confirm('Are you sure you want to delete this coupon?')) {
    Utils.showNotification('Coupon deleted successfully!', 'success');
  }
}

function openAddProductModal() {
  Utils.showNotification('Add product form coming soon!', 'success');
}

function openAddCouponModal() {
  Utils.showNotification('Add coupon form coming soon!', 'success');
}
