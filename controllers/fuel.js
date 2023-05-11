const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Fuel = require('../models/Fuel');
const Cost = require('../models/Cost');

// @desc   Get all truck Fuel
// @route  GET /api/v1/Fuel
// @access admin
exports.getFuels = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get all Fuel Cost with Date
// @route  GET /api/v1/fuel/cost
// @access admin
exports.getAllFuels = asyncHandler(async (req, res, next) => {
  const fuels = await Fuel.find()
    .select('price_total date')
    .sort({ date: -1 })
    .limit(11);
  res.status(201).json({
    data: fuels,
  });
});

// @desc   Create new Fuel
// @route  POST /api/v1/Fuel
// @access admin

exports.createFuel = asyncHandler(async (req, res, next) => {
  const fuel = await Fuel.create(req.body);
  const cost = {
    fuel: fuel._id,
    truck: fuel.truck,
    date: fuel.date,
    type: 'Fuel',
    description: fuel.description,
    price_total: fuel.price_total,
  };
  Cost.create(cost);
  res.status(201).json({
    success: true,
    data: fuel,
  });
});

// @desc   Get a single Fuel
// @route  GET /api/v1/Fuel/:id
// @access admin

exports.getFuel = asyncHandler(async (req, res, next) => {
  const fuel = await Fuel.findById(req.params.id);

  if (!fuel) {
    return next(
      new ErrorResponse('Fuel not found with id of ' + req.params.id, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: fuel,
  });
});
// @desc   Update Fuel
// @route  PUT /api/v1/fuel/:id
// @access admin

exports.updateFuel = asyncHandler(async (req, res, next) => {
  let fuel = await Fuel.findById(req.params.id);

  if (!fuel) {
    return next(
      new ErrorResponse('Fuel not found with id of ' + req.params.id, 404)
    );
  }
  const costId = await Cost.findOne({ fuel: req.params.id }).select('_id');

  await Fuel.findByIdAndUpdate(req.params.id, req.body);

  const cost = {
    fuel: req.params.id,
    date: req.body.date,
    price_total: req.body.price_total,
  };
  await Cost.findByIdAndUpdate(costId, cost);
  res.status(200).json({
    success: true,
  });
});

// @desc   Delete Fuel
// @route  Delete /api/v1/Fuel/:id
// @access admin

exports.deleteFuel = asyncHandler(async (req, res, next) => {
  let fuel = await Fuel.deleteOne({ _id: req.params.id });

  if (!fuel) {
    return next(
      new ErrorResponse('Fuel not found with id of ' + req.params.id, 404)
    );
  }

  await Cost.deleteOne({ fuel: req.params.id });

  Fuel.deleteOne(fuel);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc   check Fuels data
// @route  get /api/v1/fuel/check/:itruck_id
// @access admin

exports.checkFuels = asyncHandler(async (req, res, next) => {
  let count = await Fuel.countDocuments({ truck: req.params.truck_id });
  let result = false;
  if (count > 0) {
    result = true;
  } else {
    result = false;
  }

  res.status(200).json({
    result,
  });
});
