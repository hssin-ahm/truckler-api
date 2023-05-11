const mongoose = require('mongoose');

const CostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add a type'],
    },
    date: {
      type: Date,
    },
    price_total: {
      type: Number,
    },
    description: {
      type: String,
    },
    truck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
    },
    fuel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Fuel',
    },
    intervention: {
      type: mongoose.Schema.ObjectId,
      ref: 'Intervention',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cost', CostSchema);
