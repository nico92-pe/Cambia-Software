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

module.exports = router;