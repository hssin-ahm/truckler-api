const mongoose = require('mongoose');

const FournisseurSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    adresse: {
      type: String,
      required: [true, 'Please add a adresse'],
      trim: true,
    },
    phone_number: {
      type: Number,
      required: [true, 'Please add a phone number'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fournisseur', FournisseurSchema);
