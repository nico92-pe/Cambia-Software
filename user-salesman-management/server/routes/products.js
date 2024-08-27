const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a product
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    code: req.body.code,
    category: req.body.category,
    catPrice: req.body.catPrice,
    distPrice: req.body.distPrice,
    masterQ: req.body.masterQ
  });

  try {
    const newProduct = await product.save();
    console.log('Product saved successfully:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        code: req.body.code,
        category: req.body.category,
        catPrice: req.body.catPrice,
        distPrice: req.body.distPrice,
        masterQ: req.body.masterQ
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;