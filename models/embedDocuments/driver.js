const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
    code_postal: {
      type: Number,
      trim: true,
    },
  },
  { _id: false }
);

module.exports = DriverSchema;
