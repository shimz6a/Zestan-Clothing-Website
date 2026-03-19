# ZESTAAN - Premium E-Commerce Platform

A fully functional, premium e-commerce website for ZESTAAN, a high-end clothing brand competing in the luxury fashion market. Built with modern web technologies and Nike-level design sophistication.

## 🌟 Project Overview

ZESTAAN is a complete e-commerce platform featuring:
- **Luxury shopping experience** with sophisticated design and intuitive navigation
- **Multiple customer segments**: Men, Women, Kids, and Accessories
- **Advanced product discovery** with intelligent filtering and search
- **Comprehensive admin dashboard** for managing inventory, orders, and analytics
- **Fully responsive design** across desktop, tablet, and mobile devices

## 🎨 Design Philosophy

- **Color Palette**: Black/white base with strong typography emphasis
- **Aesthetic**: Clean, premium, bold, minimal—inspired by Nike's design language
- **Visual Hierarchy**: Large hero sections, strategic whitespace, high-contrast typography
- **Animations**: Smooth transitions and micro-interactions without compromising performance

## 📂 Project Structure

```
zestaan/
├── index.html                 # Homepage with dynamic hero banners
├── products.html              # Product listing with advanced filtering
├── cart.html                  # Shopping cart page
├── admin.html                 # Admin dashboard
├── about.html                 # About page
├── contact.html               # Contact page
├── css/
│   ├── style.css             # Main stylesheet (design system)
│   ├── home.css              # Homepage-specific styles
│   ├── products.css          # Product listing styles
│   ├── cart.css              # Cart page styles
│   └── admin.css             # Admin dashboard styles
├── js/
│   ├── main.js               # Core JavaScript (API, Utils, Header)
│   ├── cart.js               # Shopping cart manager
│   ├── wishlist.js           # Wishlist manager
│   ├── home.js               # Homepage functionality
│   ├── products.js           # Product filtering & search
│   └── admin.js              # Admin dashboard logic
└── README.md                 # This file
```

## 🚀 Features Implemented

### ✅ Homepage
- **Dynamic Hero Carousel**: 5 rotating banners (New Arrivals, Best Sellers, Limited Drops, Seasonal, Exclusive)
- **Category Showcase**: Visual grid for Men/Women/Kids/Accessories
- **Collection Sections**: New Arrivals, Best Sellers, Seasonal Collection
- **Features Section**: Free Shipping, Easy Returns, Secure Payment, 24/7 Support
- **Newsletter Signup**: Email subscription with validation
- **Lazy Loading**: Optimized image loading for performance

### ✅ Navigation
- **Sticky Header**: Smooth scroll behavior with shadow on scroll
- **Dropdown Menus**: Category-based subcategory navigation
- **Mobile Hamburger Menu**: Collapsible navigation for mobile devices
- **Search Functionality**: Real-time product search
- **Cart & Wishlist Badges**: Live update counters

### ✅ Product Listing
- **Advanced Filtering**:
  - Category (Men, Women, Kids, Accessories)
  - Price Range (Min/Max)
  - Size (XS to XXL)
  - Color (Visual color swatches)
  - Tags (New, Best Seller, Exclusive, Limited, Seasonal)
- **Sorting Options**:
  - Price (Low to High, High to Low)
  - Name (A-Z, Z-A)
  - Rating (Highest Rated)
  - Newest First
  - Featured (Default)
- **Active Filter Tags**: Visual display of applied filters with removal
- **Pagination**: Smooth multi-page navigation
- **Mobile Filters**: Slide-in sidebar for mobile devices
- **Results Counter**: Real-time product count display

### ✅ Shopping Cart
- **Item Management**: Add, remove, update quantities
- **Variant Selection**: Size and color tracking per item
- **Price Calculation**: Subtotal, shipping, tax, and total
- **Stock Validation**: Prevents ordering out-of-stock items
- **Coupon System**: Apply discount codes
- **Persistent Storage**: LocalStorage for cart persistence
- **Real-time Updates**: Live badge updates

### ✅ Wishlist
- **Quick Add**: Heart icon on product cards
- **Persistent Storage**: LocalStorage for wishlist persistence
- **Move to Cart**: Convert wishlist items to cart
- **Visual Feedback**: Active heart icon for saved items

### ✅ Admin Dashboard
- **Dashboard Overview**:
  - Total Revenue, Orders, Products, Customers stats
  - Sales Chart (Line graph)
  - Category Distribution (Doughnut chart)
  - Recent Orders list
- **Products Management**:
  - View all products in table format
  - Product images, category, price, stock display
  - Edit/Delete actions (placeholders)
- **Orders Management**:
  - View all orders with customer details
  - Order status tracking
  - Date and total display
  - Status filtering
- **Inventory Management**:
  - Stock level monitoring
  - Low stock alerts
  - Out of stock tracking
  - Quick stock update
- **Coupons Management**:
  - View all coupons
  - Discount type (percentage/fixed)
  - Expiry dates
  - Active/Inactive status
- **Analytics Dashboard**:
  - Conversion Rate
  - Average Order Value
  - Customer Retention
  - Traffic vs Sales correlation chart

## 💾 Database Schema

The platform uses a RESTful Table API with the following schemas:

### Products Table
- `id`: Unique product identifier
- `name`: Product name
- `category`: Main category (Men/Women/Kids/Accessories)
- `subcategory`: Product type (Shirts/Pants/Jackets/etc.)
- `description`: Rich text description
- `price`: Regular price
- `sale_price`: Discounted price
- `colors`: Array of available colors
- `sizes`: Array of available sizes
- `images`: Array of product image URLs
- `video_url`: Product video URL
- `fabric`: Fabric type
- `stock`: Stock quantity
- `tags`: Product tags (new/bestseller/exclusive/limited/sale)
- `rating`: Average rating (1-5)
- `review_count`: Number of reviews
- `featured`: Boolean for featured products

### Orders Table
- `id`: Unique order identifier
- `user_email`: Customer email
- `user_name`: Customer name
- `items`: Array of order items
- `total`: Order total amount
- `status`: Order status (Pending/Processing/Shipped/Delivered/Cancelled)
- `payment_method`: Payment method used
- `shipping_address`: Delivery address
- `tracking_number`: Shipment tracking number
- `order_date`: Order placement date
- `phone`: Customer phone number

### Reviews Table
- `id`: Unique review identifier
- `product_id`: Associated product ID
- `user_name`: Reviewer name
- `rating`: Rating (1-5)
- `title`: Review title
- `comment`: Review text
- `verified`: Verified purchase flag
- `helpful_count`: Helpful votes
- `review_date`: Review submission date

### Users Table
- `id`: Unique user identifier
- `email`: User email
- `name`: User name
- `phone`: User phone
- `membership_tier`: Loyalty tier (Bronze/Silver/Gold/Platinum)
- `points`: Loyalty points balance
- `wishlist`: Array of wishlist product IDs
- `addresses`: Array of saved addresses

### Coupons Table
- `id`: Unique coupon identifier
- `code`: Coupon code
- `discount_type`: Discount type (percentage/fixed)
- `discount_value`: Discount amount or percentage
- `min_purchase`: Minimum purchase requirement
- `expiry_date`: Expiration date
- `active`: Active status
- `usage_count`: Times used

### Blog Posts Table
- `id`: Unique post identifier
- `title`: Post title
- `content`: Rich text content
- `category`: Post category (Trends/Style Guide/Fashion Tips/Behind the Scenes)
- `featured_image`: Featured image URL
- `author`: Author name
- `publish_date`: Publication date
- `tags`: Post tags array

## 🔌 API Integration

The platform uses a RESTful Table API for data management:

### Endpoints
- `GET /tables/{table}` - List records with pagination
- `GET /tables/{table}/{id}` - Get single record
- `POST /tables/{table}` - Create new record
- `PUT /tables/{table}/{id}` - Update record
- `PATCH /tables/{table}/{id}` - Partial update
- `DELETE /tables/{table}/{id}` - Delete record

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 100)
- `search`: Search query
- `sort`: Sort field

## 🎯 Sample Data

The platform includes 12 sample products:
- Premium Cotton T-Shirt (Men)
- Slim Fit Chino Pants (Men)
- Leather Jacket - Premium (Men)
- Performance Sneakers (Men)
- Elegant Maxi Dress (Women)
- Cashmere Sweater (Women)
- High-Waist Jeans (Women)
- Designer Handbag (Accessories)
- Kids Adventure Jacket (Kids)
- Organic Cotton Tee - Kids (Kids)
- Activewear Sports Bra (Women)
- Classic Oxford Shirt (Men)

## 🌐 Page URLs

### Customer-Facing Pages
- `/index.html` - Homepage
- `/products.html` - All Products
- `/products.html?category=men` - Men's Products
- `/products.html?category=women` - Women's Products
- `/products.html?category=kids` - Kids Products
- `/products.html?category=accessories` - Accessories
- `/products.html?tag=new` - New Arrivals
- `/products.html?tag=bestseller` - Best Sellers
- `/products.html?tag=sale` - Sale Items
- `/products.html?search=query` - Search Results
- `/cart.html` - Shopping Cart
- `/about.html` - About ZESTAAN
- `/contact.html` - Contact Us

### Admin Pages
- `/admin.html` - Admin Dashboard
- `/admin.html#dashboard` - Dashboard Overview
- `/admin.html#products` - Products Management
- `/admin.html#orders` - Orders Management
- `/admin.html#inventory` - Inventory Management
- `/admin.html#coupons` - Coupons Management
- `/admin.html#analytics` - Analytics Dashboard

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Classes, Async/Await, Modules
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts (Inter)**: Typography
- **Chart.js**: Analytics visualization
- **LocalStorage API**: Cart and wishlist persistence
- **Fetch API**: RESTful API communication

## 🎨 Design Features

- **Premium Black & White Aesthetic**: Sophisticated color palette
- **Strong Typography**: Inter font family with multiple weights
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and keyframes
- **Lazy Loading**: Performance optimization
- **Hover Effects**: Interactive micro-interactions
- **Sticky Navigation**: Always accessible header
- **Modal Patterns**: Overlay interactions

## ⚠️ Features Not Yet Implemented

### High Priority
- **Product Detail Page**: Image zoom, 360° view, variant selection, reviews
- **Checkout Flow**: Multi-step checkout, payment integration
- **User Authentication**: Login, registration, account management
- **Order Tracking**: Real-time shipment tracking interface
- **Product Reviews**: Review submission and filtering

### Medium Priority
- **Wishlist Page**: Dedicated wishlist view
- **Size Guide**: Interactive sizing tool
- **FAQ Page**: Comprehensive Q&A
- **Blog/Lookbook**: Fashion content and styling guides
- **Membership Program**: Loyalty tiers and rewards
- **Product Customization**: Personalization options
- **Social Integration**: Instagram shop connectivity
- **Image Search**: Visual product search
- **Build Your Outfit**: Outfit composition tool
- **Careers Page**: Job listings

### Admin Features
- **Product CRUD**: Full create/update/delete for products
- **Order Management**: Update order status, add tracking
- **Coupon Management**: Full CRUD for coupons
- **User Management**: Customer account administration
- **Blog Management**: Content creation and publishing

## 🚀 Recommended Next Steps

1. **Complete Product Detail Page**:
   - Implement image gallery with zoom
   - Add size/color variant selection
   - Build review submission system
   - Add related products recommendations

2. **Build Checkout Flow**:
   - Create multi-step checkout process
   - Integrate payment gateway (Stripe/PayPal)
   - Add address validation
   - Implement order confirmation

3. **User Authentication**:
   - Build login/registration system
   - Create user dashboard
   - Add order history
   - Implement password recovery

4. **Enhance Admin Dashboard**:
   - Add product editing forms
   - Implement order status updates
   - Build coupon management forms
   - Add bulk operations

5. **Additional Pages**:
   - Complete FAQ with accordion UI
   - Build interactive Size Guide
   - Create Blog/Lookbook system
   - Add Careers page

6. **Advanced Features**:
   - Implement loyalty program
   - Add product recommendations AI
   - Build image search capability
   - Create outfit builder tool
   - Add live chat support

7. **Performance Optimization**:
   - Implement CDN for images
   - Add service worker for offline
   - Optimize bundle sizes
   - Implement code splitting

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: 480px to 767px
- **Small Mobile**: Below 480px

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

© 2024 ZESTAAN. All rights reserved.

## 👥 Contact

For questions or support:
- Email: support@zestaan.com
- Phone: +1 (555) 123-4567

---

**Built with ❤️ for premium fashion e-commerce**
