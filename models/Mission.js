const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const MissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    //start adresse
    start_location: {
      type: String,
      required: [true, 'Please add a Start Location*'],
      trim: true,
    },
    location_start: {
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
    //end adresse
    end_location: {
      type: String,
      required: [true, 'Please add a End Location*'],
      trim: true,
    },
    location_end: {
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
    status: {
      type: String,
      // required: true,
      enum: ['Complete', 'Incomplete', 'In progress'],
    },
    date: {
      type: String,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
    },
    driver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    truck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'Client',
    },
  },
  {
    timestamps: true,
  }
);

MissionSchema.pre('save', async function (next) {
  this.status = 'In progress';
  //start location
  const loc_start = await geoCoder.geocode(this.start_location);
  this.location_start = {
    type: 'Point',
    coordinates: [loc_start[0].longitude, loc_start[0].latitude],
    formattedAddress: loc_start[0].formattedAddress,
    street: loc_start[0].streetName,
    city: loc_start[0].city,
    state: loc_start[0].stateCode,
    zipcode: loc_start[0].zipcode,
    country: loc_start[0].countryCode,
  };

  //end location
  const loc_end = await geoCoder.geocode(this.end_location);
  this.location_end = {
    type: 'Point',
    coordinates: [loc_end[0].longitude, loc_end[0].latitude],
    formattedAddress: loc_end[0].formattedAddress,
    street: loc_end[0].streetName,
    city: loc_end[0].city,
    state: loc_end[0].stateCode,
    zipcode: loc_end[0].zipcode,
    country: loc_end[0].countryCode,
  };

  next();
});

module.exports = mongoose.model('Mission', MissionSchema);
