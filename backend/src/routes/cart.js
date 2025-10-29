const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

const MOCK_USER_ID = 'user_123'; // Mock user ID for persistence

// POST /api/cart - Add item to cart
router.post('/', async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.body.userId || MOCK_USER_ID;
    
    if (!productId || !qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity (min 1) are required'
      });
    }
    
    // Check if product exists
    const productCheck = await pool.query(
      'SELECT id, name, price FROM products WHERE id = $1',
      [productId]
    );
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Insert or update cart item
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, productId, qty]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Item added to cart'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/cart - Get cart with total
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId || MOCK_USER_ID;
    
    const result = await pool.query(
      `SELECT 
        ci.id,
        ci.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.image_url,
        (ci.quantity * p.price) as subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [userId]
    );
    
    // Calculate total
    const total = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    res.json({
      success: true,
      data: {
        items: result.rows,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || MOCK_USER_ID;
    
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
