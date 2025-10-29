import { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import { productsAPI, cartAPI } from './api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      console.log('Products API Response:', response);
      console.log('Response data:', response.data);
      
      // Check if response has the expected structure
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setError(null);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where data might be directly in response.data
        setProducts(response.data);
        setError(null);
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('Invalid response format from server.');
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      console.log('Cart API Response:', response);
      
      if (response.data && response.data.data) {
        setCartItems(response.data.data.items || []);
        setCartTotal(response.data.data.total || 0);
      } else {
        console.error('Unexpected cart response structure:', response.data);
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      console.error('Error response:', err.response?.data);
      setCartItems([]);
      setCartTotal(0);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.add(productId, quantity);
      await loadCart();
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
      console.error('Error adding to cart:', err);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await cartAPI.remove(cartItemId);
      await loadCart();
    } catch (err) {
      setError('Failed to remove item from cart. Please try again.');
      console.error('Error removing from cart:', err);
    }
  };

  const handleCheckout = async () => {
    await loadCart();
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">Vibe Commerce</h1>
          <button 
            className="cart-button" 
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({cartItemCount})
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <div className="container">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className="container">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <ProductGrid 
              products={products} 
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </main>

      {showCart && (
        <Cart
          items={cartItems}
          total={cartTotal}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          onClose={() => setShowCart(false)}
          onCartUpdate={loadCart}
        />
      )}
    </div>
  );
}

export default App;
