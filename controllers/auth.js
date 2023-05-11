const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc   login user
// @route  POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc   GET current logged in user
// @route  POST /api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    'first_name last_name email role photo'
  );

  res.status(200).json({
    user,
  });
});

// @desc   Forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email.email;
  const resetUrl = req.body.resetUrl;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('there are no user for that email', 404));
  }

  // GEt reset token
  const resetToken = user.getResetPasswordToken();

  const resUrl = resetUrl.concat('/' + resetToken);

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUri = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Reset password - TRUCKLER\n\nA request to reset your password has been made.\nIf you haven't made this request, just ignore this email. If you have made this request, simply click on the link below: \n\n${resUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset password - TRUCKLER',
      message: message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    message: 'email has been sent!',
  });
});
// @desc   Reset password
// @route  POST /api/v1/auth/verifresetpasswordtoken/:resettoken
// @access Public

exports.verifresetpasswordtoken = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
});

// @desc   Reset password
// @route  POST /api/v1/auth/resetpassword/:resettoken
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc   Update user details
// @route  Put /api/v1/auth/updatedetails
// @access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   Update password
// @route  Put /api/v1/auth/updatepassword
// @access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('password is incorrect', 404));
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   getuserrole
// @route  Put /api/v1/auth/getuserrole
// @access Private

exports.getuserrole = asyncHandler(async (req, res, next) => {
  const role = req.user.role;

  res.status(200).json({
    role,
  });
});

//Get token from model, create and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    role: user.role,
    token,
  });
};
