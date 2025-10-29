const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

const MOCK_USER_ID = 'user_123'; // Mock user ID for persistence

// POST /api/checkout - Create order and generate receipt
router.post('/', async (req, res, next) => {
  try {
    const { name, email, cartItems } = req.body;
    const userId = req.body.userId || MOCK_USER_ID;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required'
      });
    }
    
    // Calculate total and validate items
    let total = 0;
    const orderItems = [];
    
    for (const item of cartItems) {
      const productResult = await pool.query(
        'SELECT id, name, price FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (productResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`
        });
      }
      
      const product = productResult.rows[0];
      const subtotal = parseFloat(product.price) * item.quantity;
      total += subtotal;
      
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: parseFloat(product.price),
        quantity: item.quantity,
        subtotal: subtotal
      });
    }
    
    // Create order in transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, customer_name, customer_email, total)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, name, email, total.toFixed(2)]
      );
      
      const order = orderResult.rows[0];
      
      // Insert order items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.product_id, item.product_name, item.product_price, item.quantity, item.subtotal]
        );
      }
      
      // Clear cart
      await client.query(
        'DELETE FROM cart_items WHERE user_id = $1',
        [userId]
      );
      
      await client.query('COMMIT');
      
      // Generate receipt
      const receipt = {
        orderId: order.id,
        customerName: name,
        customerEmail: email,
        total: parseFloat(total.toFixed(2)),
        items: orderItems,
        timestamp: order.created_at
      };
      
      res.status(201).json({
        success: true,
        data: receipt,
        message: 'Order placed successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
