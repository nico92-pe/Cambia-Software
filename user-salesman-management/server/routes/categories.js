const express = require('express');
const router = express.Router();
const Product = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });

  try {
    const newCategory = await Product.save();
    console.log('Category saved successfully:', newCategory);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error saving category:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;