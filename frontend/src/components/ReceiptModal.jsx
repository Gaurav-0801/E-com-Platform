const ReceiptModal = ({ receipt, onClose }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2>Order Confirmed!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="receipt-content">
          <div className="receipt-icon">✓</div>
          <p className="receipt-message">Thank you for your purchase!</p>
          
          <div className="receipt-details">
            <div className="receipt-section">
              <h3>Order Details</h3>
              <div className="receipt-info">
                <p><strong>Order ID:</strong> #{receipt.orderId}</p>
                <p><strong>Date:</strong> {formatDate(receipt.timestamp)}</p>
                <p><strong>Customer:</strong> {receipt.customerName}</p>
                <p><strong>Email:</strong> {receipt.customerEmail}</p>
              </div>
            </div>

            <div className="receipt-section">
              <h3>Items Purchased</h3>
              <div className="receipt-items">
                {receipt.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <div className="receipt-item-info">
                      <span className="receipt-item-name">{item.product_name}</span>
                      <span className="receipt-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="receipt-item-price">
                      ${item.product_price.toFixed(2)} × {item.quantity} = ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="receipt-total">
              <span>Total Amount:</span>
              <span className="total-price">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <button className="receipt-close-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
