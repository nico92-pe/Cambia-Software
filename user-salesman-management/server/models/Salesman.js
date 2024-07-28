const mongoose = require('mongoose');

const SalesmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  territory: { type: String, required: true }
});

module.exports = mongoose.model('Salesman', SalesmanSchema);