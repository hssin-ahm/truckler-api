const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a price'],
    },
    mobile: {
      type: String,
      required: [true, 'Please add a price'],
    },
    email: {
      type: String,
    },
    adresse: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Client', ClientSchema);
