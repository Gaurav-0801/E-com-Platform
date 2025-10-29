const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /api/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price, description, image_url FROM products ORDER BY id'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
