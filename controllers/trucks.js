const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Truck = require('../models/Truck');
const Intervention = require('../models/Intervention');

// @desc   Get all trucks
// @route  GET /api/v1/trucks
// @access admin
exports.getTrucks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get all trucks without pagination
// @route  GET /api/v1/trucks/all
// @access admin
exports.getTrucksWithoutPagination = asyncHandler(async (req, res, next) => {
  const trucks = await Truck.find({ disable: false })
    .select('registration_number model')
    .populate('model');
  res.status(200).json({
    success: true,
    data: trucks,
  });
});

// @desc   Search trucks with multiple filed
// @route  GET /api/v1/trucks/search/:key
// @access admin
exports.searchByKey = asyncHandler(async (req, res, next) => {
  let data = await Truck.find(
    {
      $or: [
        { registration_number: { $regex: req.params.key } },
        { transmission: { $regex: req.params.key } },
        { status: { $regex: req.params.key } },
      ],
    },
    { disable: false }
  );
  res.status(200).json({
    count: data.length,
    data,
  });
});

// @desc   Create new truck
// @route  POST /api/v1/truck
// @access admin

exports.createTruck = asyncHandler(async (req, res, next) => {
  const truck = await Truck.create(req.body);
  res.status(201).json({
    success: true,
    data: truck,
  });
});

// @desc   Get a single truck
// @route  GET /api/v1/Trucks/:id
// @access admin

exports.getTruck = asyncHandler(async (req, res, next) => {
  const truck = await Truck.findById(req.params.id).populate('information');

  if (!truck) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: truck,
  });
});
// @desc   Update truck
// @route  PUT /api/v1/trucks/:id
// @access admin

exports.updateTruck = asyncHandler(async (req, res, next) => {
  let truck = await Truck.findById(req.params.id);

  if (!truck) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
    );
  }

  await Truck.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Delete truck
// @route  Delete /api/v1/trucks/:id
// @access admin

exports.deleteTruck = asyncHandler(async (req, res, next) => {
  let truck = await Truck.findById(req.params.id);

  if (!truck) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
    );
  }

  truck.disable = true;
  await truck.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc   Upload photo for truck
// @route  PUT /api/v1/trucks/:id/photo
// @access Private

exports.truckPhotoUpload = asyncHandler(async (req, res, next) => {
  const truck = await Truck.findById(req.params.id);
  if (!truck) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
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
  file.name = `photo_${truck._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 400));
    }
    await Truck.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc   get Truck Status Data
// @route  GET /api/v1/trucks/status
// @access admin

exports.getTruckStatusData = asyncHandler(async (req, res, next) => {
  let totalActiveTruck = await Truck.countDocuments({
    statut: 'active',
    disable: false,
  });
  let totalInactiveTruck = await Truck.countDocuments({
    statut: 'inactive',
    disable: false,
  });
  let totalInShopTruck = await Truck.countDocuments({
    statut: 'in shop',
    disable: false,
  });

  res.status(200).json({
    totalActiveTruck,
    totalInactiveTruck,
    totalInShopTruck,
  });
});
