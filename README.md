# E-Commerce Cart Application

A full-stack shopping cart application built with React, Node.js, Express, and PostgreSQL (NeonDB). This project demonstrates a complete e-commerce cart flow with product listing, cart management, and mock checkout functionality.

## Features

- 🛍️ **Product Grid**: Browse through 8 mock products with beautiful card layouts
- 🛒 **Shopping Cart**: Add, update quantities, and remove items from cart
- 💾 **Persistent Cart**: Cart data persists across page refreshes using database storage
- ✅ **Checkout Flow**: Complete checkout with customer information and order receipt
- 📱 **Responsive Design**: Fully responsive UI that works on all device sizes
- 🎨 **Modern UI**: Beautiful, gradient-based design with smooth animations

## Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **PostgreSQL** (NeonDB): Database for products, cart, and orders
- **pg**: PostgreSQL client for Node.js

### Frontend
- **React 18**: Frontend framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API calls

## Project Structure

```
E com/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server setup
│   │   ├── routes/
│   │   │   ├── products.js      # Product endpoints
│   │   │   ├── cart.js          # Cart CRUD endpoints
│   │   │   └── checkout.js      # Checkout endpoint
│   │   ├── db/
│   │   │   ├── connection.js    # Database connection
│   │   │   ├── schema.sql       # Database schema
│   │   │   └── seed.js          # Seed mock products
│   │   └── middleware/
│   │       └── errorHandler.js  # Error handling middleware
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── ReceiptModal.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── index.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (NeonDB account)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database connection string:
```env
DATABASE_URL=postgresql://neondb_owner:npg_NaoGw8EJj3Sl@ep-cool-surf-ah5bb2c7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5000
FRONTEND_URL=http://localhost:5173
```

5. Initialize the database schema and seed products:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Products
- **GET** `/api/products` - Get all products

### Cart
- **GET** `/api/cart?userId=user_123` - Get cart items and total
- **POST** `/api/cart` - Add item to cart
  ```json
  {
    "productId": 1,
    "qty": 2,
    "userId": "user_123"
  }
  ```
- **DELETE** `/api/cart/:id?userId=user_123` - Remove item from cart

### Checkout
- **POST** `/api/checkout` - Create order and generate receipt
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "cartItems": [
      { "product_id": 1, "quantity": 2 }
    ],
    "userId": "user_123"
  }
  ```

## Database Schema

### Products Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `description` (TEXT)
- `image_url` (VARCHAR)

### Cart Items Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (VARCHAR)
- `product_id` (INTEGER, FK to products)
- `quantity` (INTEGER)

### Orders Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (VARCHAR)
- `customer_name` (VARCHAR)
- `customer_email` (VARCHAR)
- `total` (DECIMAL)
- `created_at` (TIMESTAMP)

### Order Items Table
- `id` (SERIAL PRIMARY KEY)
- `order_id` (INTEGER, FK to orders)
- `product_id` (INTEGER)
- `product_name` (VARCHAR)
- `product_price` (DECIMAL)
- `quantity` (INTEGER)
- `subtotal` (DECIMAL)

## Features in Detail

### Cart Persistence
The application uses a mock user ID (`user_123`) for cart persistence. All cart operations are tied to this user ID, allowing the cart to persist across page refreshes through database storage.

### Error Handling
- Backend: Comprehensive error handling middleware with proper HTTP status codes
- Frontend: User-friendly error messages with error banners
- Form validation for checkout process

### Responsive Design
- Mobile-first approach
- Responsive grid layout for products
- Mobile-optimized cart sidebar
- Touch-friendly buttons and controls

## Screenshots

(Add screenshots here showing the application in action)

## Development Notes

- The application uses a mock user ID system for cart persistence
- All API calls include error handling
- The checkout process creates an order record and clears the cart
- Product images are sourced from Unsplash

## Future Enhancements

- User authentication and real user accounts
- Product search and filtering
- Product categories
- Order history page
- Payment integration (currently mock checkout only)
- Product reviews and ratings

## License

This project is created for Vibe Commerce screening assignment.

## Author

GAURAV PANT

---

**Note**: This is a mock e-commerce application. No real payments are processed. The checkout is for demonstration purposes only.
#
<img width="2555" height="1266" alt="image" src="https://github.com/user-attachments/assets/92b96a11-3536-43a8-9efa-82df474f9190" />
<img width="2559" height="1265" alt="image" src="https://github.com/user-attachments/assets/7f1fb5da-f157-4b3d-b83b-8b3af835ecc8" />
<img width="2559" height="1272" alt="image" src="https://github.com/user-attachments/assets/4771d857-8ef2-489e-843d-872e752aa4c7" />
<img width="2549" height="1264" alt="image" src="https://github.com/user-attachments/assets/abc7cf80-4099-429a-840a-3f91aa08684b" />





