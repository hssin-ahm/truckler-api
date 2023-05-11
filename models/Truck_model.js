const mongoose = require('mongoose');

const TruckModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
    trim: true,
  },
});

module.exports = mongoose.model('TruckModel', TruckModelSchema);