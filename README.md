Zeestaan is a modern e-commerce web application designed for showcasing products, managing inventory, and handling basic CRUD operations using a Node.js backend and MongoDB database.

FEATURES

Product management (Create, Read, Update, Delete)
MongoDB database integration
RESTful API structure
Clean and scalable project structure
Easy to extend for future features
TECH STACK

Backend:
Node.js
Express.js
MongoDB
Mongoose
Frontend:

HTML
CSS
JavaScript
PROJECT STRUCTURE

Zeestaan E-Commerce/ │ ├── backend/ │ ├── models/ │ ├── routes/ │ ├── controllers/ │ ├── config/ │ └── server.js │ ├── frontend/ │ ├── assets/ │ ├── css/ │ ├── js/ │ └── index.html │ ├── node_modules/ ├── package.json └── README.txt

INSTALLATION & SETUP

Clone the repository git clone https://github.com/your-username/zeestaan-ecommerce.git

Install dependencies npm install

Create a .env file and add: MONGO_URI=your_mongodb_connection_string PORT=5000

Run the server npm start

Server will run on: http://localhost:5000

API ENDPOINTS (EXAMPLE)

GET /api/products - Get all products POST /api/products - Add a new product PUT /api/products/:id - Update a product DELETE /api/products/:id - Delete a product

FUTURE IMPROVEMENTS

User authentication
Admin dashboard
Payment gateway integration
Order management
Product reviews and ratings

Author

Sheemaz Rehan
Mudassir Ali  
Abdul Rehman Khan 

