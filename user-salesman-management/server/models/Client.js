const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  ruc: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  shortName: { type: String, required: true },
  contact1: { type: String, required: true },
  phone1: { type: String, required: true },
  contact2: { type: String },
  phone2: { type: String },
  address: { type: String, required: true },
  district: { type: String, required: true },
  province: { type: String, required: true },
  department: { type: String, required: true },
  reference: { type: String },
  transportAgency: { type: String },
  transportAddress: { type: String },
  transportDistrict: { type: String },
  transportReference: { type: String },
  assignedSalesman: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;