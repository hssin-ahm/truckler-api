const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Model = require('../models/Truck_model');

// @desc   Create new truck model
// @route  POST /api/v1/model
// @access admin

exports.createTruckModel = asyncHandler(async (req, res, next) => {
  const model = await Model.create(req.body);
  res.status(201).json({
    success: true,
    data: model,
  });
});

// @desc   Get All truck model
// @route  Get /api/v1/model
// @access admin

exports.getTruckModels = asyncHandler(async (req, res, next) => {
  const models = await Model.find();
  res.status(201).json({
    models,
  });
});

// @desc   Upload photo for the truck model
// @route  PUT /api/v1/model/photo
// @access Private

exports.truckModelPhotoUpload = asyncHandler(async (req, res, next) => {
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
  file.name = `photo_${file.name}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 400));
    }
    //await Truck.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
