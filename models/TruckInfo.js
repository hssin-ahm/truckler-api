const mongoose = require('mongoose');

const TruckInfoSchema = new mongoose.Schema(
  {
    speed: {
      type: String,
      trim: true,
    },
    mileage: {
      type: String,
    },
    fuel: {
      type: String,
    },
    adresse: {
      type: String,
      trim: true,
    },
    location: {
      //GeoJSON point

      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    truck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
      unique: [true, 'this truck information for this truck is already exist'],
    },
  },
  {
    timestamps: true,
  }
);
TruckInfoSchema.pre('save', async function (next) {
  if (!this.location) {
    const currentlocation = await geoCoder.geocode(this.adresse);
    this.location = {
      type: 'Point',
      coordinates: [currentlocation[0].longitude, currentlocation[0].latitude],
      formattedAddress: currentlocation[0].formattedAddress,
      street: currentlocation[0].streetName,
      city: currentlocation[0].city,
      state: currentlocation[0].stateCode,
      zipcode: currentlocation[0].zipcode,
      country: currentlocation[0].countryCode,
    };
  }
  next();
});
module.exports = mongoose.model('TruckInfo', TruckInfoSchema);
