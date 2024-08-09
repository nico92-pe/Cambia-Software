const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  catPrice: { type: Number, required: true },
  distPrice: { type: Number, required: true },
  masterQ: { type: Number, required: true }
}, { collection: 'products' });

module.exports = mongoose.model('Product', ProductSchema);




