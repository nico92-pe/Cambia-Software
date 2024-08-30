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
    phoneNumber: req.body.phoneNumber,
    shortName: req.body.shortName,
    bankAccount: req.body.bankAccount,
    bank: req.body.bank,
    birthday: req.body.birthday
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
    const updatedSalesman = await Salesman.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        shortName: req.body.shortName,
        bankAccount: req.body.bankAccount,
        bank: req.body.bank,
        birthday: req.body.birthday
      },
      { new: true }
    );
    if (!updatedSalesman) {
      return res.status(404).json({ message: 'Salesman not found' });
    }
    res.json(updatedSalesman);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a salesman
router.delete('/:id', async (req, res) => {
  try {
    const deletedSalesman = await Salesman.findByIdAndDelete(req.params.id);
    if (!deletedSalesman) {
      return res.status(404).json({ message: 'Salesman not found' });
    }
    res.json({ message: 'Salesman deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;