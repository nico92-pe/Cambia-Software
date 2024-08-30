const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  shortName: { type: String, required: true, trim: true },
  bankAccount: { type: String, required: true, trim: true },
  bank: { type: String, required: true, trim: true },
  birthday: { type: Date,  required: true }
}, { timestamps: true }
);

const Salesman = mongoose.model('Salesman', salesmanSchema);

module.exports = Salesman;