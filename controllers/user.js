const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const path = require('path');

// @desc      Get all users
// @route     GET /api/v1/users/all
// @access    Private/super_admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get all drivers
// @route     GET /api/v1/auth/drivers
// @access    Private
exports.getAllDrivers = asyncHandler(async (req, res, next) => {
  const drivers = await User.find({ role: 'driver' }).select(
    'first_name last_name'
  );
  res.status(200).json({
    success: true,
    data: drivers,
  });
});

// @desc   Create user
// @route  POST /api/v1/user/create
// @access Private/super_admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  const driver = {
    phone_number: req.body.phone_number,
    adresse: req.body.adresse,
    code_postal: req.body.code_postal,
  };

  //Create user
  const user = await User.create({
    driver,
    first_name,
    last_name,
    email,
    password,
    role,
  });

  const message = `your account has been created\nyour passwoed is: ${password}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Truckler',
      message: message,
    });
  } catch (error) {
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   Update user
// @route  Put /api/v1/user/updateuser/:userid
// @access super_admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const driverFieldsToUpdate = {
    phone_number: req.body.phone_number,
    adresse: req.body.adresse,
    code_postal: req.body.code_postal,
  };
  const fieldsToUpdate = {
    driver: driverFieldsToUpdate,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   Update logged user
// @route  Put /api/v1/user/updateloggeduser/:userid
// @access super_admin

exports.updateloggeduser = asyncHandler(async (req, res, next) => {
  if (req.user.id != req.params.id) {
    return next(
      new ErrorResponse(
        'not authorized to update this information' + req.params.id,
        404
      )
    );
  }
  const fieldsToUpdate = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc   change password
// @route  POST /api/v1/auth/changepassword
// @access Public

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.user);

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.status(200).json({
    success: true,
  });
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse('user not found with id of ' + req.params.id, 404)
    );
  }

  await User.deleteOne(user);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc   Upload photo for user
// @route  PUT /api/v1/users/:id/photo
// @access private

exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  if (req.user.id != req.params.id) {
    return next(
      new ErrorResponse(
        'not authorized to uploade this image' + req.params.id,
        404
      )
    );
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse('user not found with id of ' + req.params.id, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please uploade a file`, 400));
  }

  const file = req.files.file;

  //Make sure the file is a image file

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please uploade a image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please uploade a image less then ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename ex: photo_458478554.png
  file.name = `photo_${user._id}${path.parse(file.name).name}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 400));
    }
    await User.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
