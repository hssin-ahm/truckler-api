const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema(
  {
    registration_number: {
      type: String,
      required: [true, 'Please add a Registration Number'],
      unique: true,
      trim: true,
    },
    date_of_registration: {
      type: Date,
      required: [true, 'Please add a date of registration'],
      unique: [true, 'truck exists'],
    },
    model: {
      type: mongoose.Schema.ObjectId,
      ref: 'TruckModel',
    },
    labels: {
      type: [String],
    },
    statut: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'in shop'],
    },
    // motor information
    transmission: {
      type: String,
      required: true,
      enum: ['manuel', 'automatique'],
    },
    fuel_type: {
      type: String,
      required: true,
      enum: ['Essence', 'Diesel', 'LPG', 'Electrique', 'Hybride'],
    },
    // g/km
    co2_emission: {
      type: Number,
    },
    number_of_horses: {
      type: String,
    },
    puissance: {
      type: Number,
    },

    information: {
      type: mongoose.Schema.ObjectId,
      ref: 'TruckInfo',
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Truck', TruckSchema);
