const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DriverSchema = require('./embedDocuments/driver');

const UserSchema = new mongoose.Schema(
  {
    driver: DriverSchema,
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'driver'],
      default: 'super_admin',
    },
    first_name: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    last_name: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
    },
    email: {
      type: String,
      required: [true, 'Please add a email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: 'no-photo.png',
      trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  {
    timestamps: true,
  }
);

//encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate a token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  var minutesToAdd = 10;
  var currentDate = new Date();
  var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

  this.resetPasswordExpire = futureDate;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
