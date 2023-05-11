const mongoose = require('mongoose');

const InterventionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add a type'],
    },
    price: {
      type: String,
      required: [true, 'Please add a price'],
    },
    date: {
      type: Date,
    },
    invoice_ref: {
      type: String,
      required: [true, 'Please add a invoice'],
    },
    description: {
      type: String,
    },
    fournisseur: {
      type: mongoose.Schema.ObjectId,
      ref: 'Fournisseur',
    },
    truck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Intervention', InterventionSchema);
