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
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      setCartItems(response.data.data.items);
      setCartTotal(response.data.data.total);
    } catch (err) {
      console.error('Error loading cart:', err);
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
