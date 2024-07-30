const express = require('express');
const router = express.Router();
const Salesman = require('../models/Salesman');

// Get all salesmen
router.get('/', async (req, res) => {
    try {
      const salesmen = await Salesman.find();
      res.json(salesmen);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Create a salesman
router.post('/', async (req, res) => {
  const salesman = new Salesman({
    name: req.body.name,
    email: req.body.email,
    territory: req.body.territory
  });

  try {
    const newSalesman = await salesman.save();
    res.status(201).json(newSalesman);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a salesman
router.put('/:id', async (req, res) => {
  try {
    const updatedSalesman = await Salesman.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSalesman) return res.status(404).json({ message: 'User not found' });
    res.json(updatedSalesman);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a salesman
router.delete('/:id', async (req, res) => {
  try {
    const deletedSalesman = await Salesman.findByIdAndDelete(req.params.id);
    if (!deletedSalesman) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;