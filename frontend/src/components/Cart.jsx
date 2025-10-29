import { useState } from 'react';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';
import ReceiptModal from './ReceiptModal';

const Cart = ({ items, total, onRemove, onCheckout, onClose, onCartUpdate }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleCheckoutComplete = (receiptData) => {
    setReceipt(receiptData);
    setShowCheckout(false);
    onCartUpdate();
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    onClose();
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p className="empty-cart-subtitle">Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={onRemove}
                    onUpdate={onCartUpdate}
                  />
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutForm
          cartItems={items}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutComplete}
        />
      )}

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={handleCloseReceipt}
        />
      )}
    </>
  );
};

export default Cart;
