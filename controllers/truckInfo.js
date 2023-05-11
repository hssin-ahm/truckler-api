const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const TruckInfo = require('../models/TruckInfo');

const Truck = require('../models/Truck');

// @desc   Get all trucksInfo
// @route  GET /api/v1/truckinfos
// @access admin
exports.getTruckInfos = asyncHandler(async (req, res, next) => {
  const truckInfo = await TruckInfo.find({ status: 'active' }).populate({
    path: 'truck',
    populate: {
      path: 'model',
    },
  });
  res.status(200).json({
    success: true,
    truckInfo,
  });
});

// @desc   Create new truck
// @route  POST /api/v1/truckinfo
// @access admin

exports.createTruckinfo = asyncHandler(async (req, res, next) => {
  const truckInfo = await TruckInfo.create(req.body);
  req.io.emit('new information added', truckInfo);

  res.status(201).json({
    success: true,
    truckInfo,
  });
});

// @desc   Update truck information
// @route  POST /api/v1/truck
// @access admin

exports.updateTruckinfo = asyncHandler(async (req, res, next) => {
  let truckInfo = await TruckInfo.findById(req.params.id);

  if (!truckInfo) {
    req.body.truck = req.params.id;
    truckInfo = await TruckInfo.create(req.body);
    req.io.emit('new information added', truckInfo);

    res.status(201).json({
      success: true,
      truckInfo,
    });
  }

  let truck = await Truck.findById(truckInfo.truck._id);

  if (!truck) {
    return next(
      new ErrorResponse('truck not found with id of ' + req.params.id, 404)
    );
  }
  truck = await Truck.findByIdAndUpdate(truckInfo.truck._id, {
    statut: 'active',
  });

  truckInfo = await TruckInfo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate({
    path: 'truck',
    populate: {
      path: 'model',
    },
  });

  req.io.emit('new information added', truckInfo);

  res.status(201).json({
    success: true,
  });
});

// @desc   Delete truck info
// @route  Delete /api/v1/truckinfo/:id
// @access admin

exports.deleteTruckInfo = asyncHandler(async (req, res, next) => {
  let truckInfo = await TruckInfo.findById(req.params.id);

  if (!truckInfo) {
    return next(
      new ErrorResponse('truck info not found with id of ' + req.params.id, 404)
    );
  }

  await TruckInfo.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
