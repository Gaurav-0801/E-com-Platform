import { useState } from 'react';
import { cartAPI } from '../api';

const CartItem = ({ item, onRemove, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await cartAPI.add(item.product_id, newQuantity);
      setQuantity(newQuantity);
      onUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image_url} alt={item.name} />
      </div>
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">${item.price}</p>
        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={updating || quantity <= 1}
            >
              −
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={updating}
            >
              +
            </button>
          </div>
          <button
            className="remove-btn"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
        <div className="cart-item-subtotal">
          Subtotal: ${(item.price * quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
