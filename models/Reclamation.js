const mongoose = require("mongoose");

const ReclamationSchema = new mongoose.Schema({
  typeReclamation: {
    type: String,
  },

  date: {
    type: Date,
  },

  description: {
    type: String,
  },

  driver: {
    type: mongoose.Schema.ObjectId,
    ref: "Driver",
  },
  truck: {
    type: mongoose.Schema.ObjectId,
    ref: "Truck",
  },
});

module.exports = mongoose.model("Reclamation", ReclamationSchema);
