require('dotenv').config();
const pool = require('./connection');
const fs = require('fs');
const path = require('path');

// Fallback mock products if FakeStore API fails
const mockProducts = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'Premium wireless headphones with noise cancellation',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with fitness tracking',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
  },
  {
    name: 'Laptop Stand',
    price: 49.99,
    description: 'Ergonomic aluminum laptop stand for better posture',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
  },
  {
    name: 'Mechanical Keyboard',
    price: 129.99,
    description: 'RGB mechanical keyboard with tactile switches',
    image_url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop'
  },
  {
    name: 'Wireless Mouse',
    price: 39.99,
    description: 'Ergonomic wireless mouse with precision tracking',
    image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'
  },
  {
    name: 'USB-C Hub',
    price: 59.99,
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
    image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop'
  },
  {
    name: 'External SSD',
    price: 89.99,
    description: '1TB high-speed external SSD for storage',
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d94bd14b?w=500&h=500&fit=crop'
  },
  {
    name: 'Webcam HD',
    price: 69.99,
    description: '1080p HD webcam with auto-focus and microphone',
    image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop'
  }
];

/**
 * Fetch products from FakeStore API
 * @returns {Promise<Array>} Array of transformed products
 */
async function fetchProductsFromFakeStore() {
  try {
    console.log('Fetching products from FakeStore API...');
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Invalid response from FakeStore API');
    }
    
    // Transform FakeStore API response to match database schema
    // Limit to 5-10 products as specified
    const limit = Math.min(10, Math.max(5, products.length));
    const transformedProducts = products.slice(0, limit).map(product => ({
      name: product.title,
      price: parseFloat(product.price),
      description: product.description || 'No description available',
      image_url: product.image
    }));
    
    console.log(`Successfully fetched ${transformedProducts.length} products from FakeStore API`);
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching from FakeStore API:', error.message);
    console.log('Falling back to mock products...');
    return null;
  }
}

async function seedDatabase() {
  try {
    // Verify DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('ERROR: DATABASE_URL is not set in environment variables');
      console.error('Please create a .env file in the backend directory');
      console.error('Example: DATABASE_URL=postgresql://user:password@host/database');
      process.exit(1);
    }

    console.log('Starting database seeding...');
    console.log('Connection string format:', process.env.DATABASE_URL.substring(0, 30) + '...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for "IF NOT EXISTS" statements that already exist
          if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
            throw error;
          }
        }
      }
    }
    
    console.log('Database schema created successfully');

    // Clear existing data in correct order to avoid foreign key constraint violations
    // Delete orders first (this will cascade delete order_items due to ON DELETE CASCADE)
    await pool.query('DELETE FROM orders');
    // Delete cart items (will cascade automatically, but being explicit for clarity)
    await pool.query('DELETE FROM cart_items');
    // Now safe to delete products
    await pool.query('DELETE FROM products');
    
    console.log('Cleared existing data successfully');
    
    // Try to fetch products from FakeStore API, fallback to mock products
    let productsToSeed = await fetchProductsFromFakeStore();
    
    if (!productsToSeed) {
      console.log('Using fallback mock products');
      productsToSeed = mockProducts;
    }
    
    // Insert products
    for (const product of productsToSeed) {
      await pool.query(
        'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4)',
        [product.name, product.price, product.description, product.image_url]
      );
    }
    
    console.log(`Seeded ${productsToSeed.length} products successfully`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error('Full error:', error);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();
