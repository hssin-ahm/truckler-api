const mongoose = require('mongoose');

const FuelSchema = new mongoose.Schema(
  {
    number_of_liter: {
      type: String,
      required: [true, 'Please add a price'],
    },
    price_liter: {
      type: String,
      required: [true, 'Please add a price'],
    },
    price_total: {
      type: String,
    },
    date: {
      type: Date,
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

FuelSchema.pre('save', function (next) {
  this.price_total = this.number_of_liter * this.price_liter;
  next();
});

module.exports = mongoose.model('Fuel', FuelSchema);
