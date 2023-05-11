const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Intervention = require('../models/Intervention');
const Cost = require('../models/Cost');

// @desc   Get all truck Intervention
// @route  GET /api/v1/intervention
// @access admin
exports.getInterventions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Create new Intervention
// @route  POST /api/v1/intervention
// @access admin

exports.createIntervention = asyncHandler(async (req, res, next) => {
  const intervention = await Intervention.create(req.body);
  const cost = {
    intervention: intervention._id,
    truck: intervention.truck,
    date: intervention.date,
    type: intervention.type,
    description: intervention.description,
    price_total: intervention.price,
  };
  Cost.create(cost);
  res.status(201).json({
    success: true,
    data: intervention,
  });
});

// @desc   Get a single Intervention
// @route  GET /api/v1/intervention/:id
// @access admin

exports.getIntervention = asyncHandler(async (req, res, next) => {
  const intervention = await Intervention.findById(req.params.id);
  if (!intervention) {
    return next(
      new ErrorResponse(
        'Intervention not found with id of ' + req.params.id,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: intervention,
  });
});

// @desc   Get all intervention Cost with Date
// @route  GET /api/v1/intervention/cost
// @access admin
exports.getAllinterventions = asyncHandler(async (req, res, next) => {
  const interventions = await Intervention.find()
    .select('price date')
    .sort({ date: -1 });
  res.status(201).json({
    data: interventions,
  });
});

// @desc   Update Intervention
// @route  PUT /api/v1/intervention/:id
// @access admin

exports.updateIntervention = asyncHandler(async (req, res, next) => {
  let intervention = await Intervention.findById(req.params.id);

  if (!intervention) {
    return next(
      new ErrorResponse(
        'Intervention not found with id of ' + req.params.id,
        404
      )
    );
  }
  const costId = await Cost.findOne({ intervention: req.params.id }).select(
    '_id'
  );

  await Intervention.findByIdAndUpdate(req.params.id, req.body);

  const cost = {
    intervention: req.params.id,
    date: req.body.date,
    type: req.body.type,
    description: req.body.description,
    price_total: req.body.price,
  };
  await Cost.findByIdAndUpdate(costId, cost);

  res.status(200).json({
    success: true,
  });
});

// @desc   check Interventions data
// @route  get /api/v1/intervention/check/:itruck_id
// @access admin

exports.checkInterventions = asyncHandler(async (req, res, next) => {
  let count = await Intervention.countDocuments({ truck: req.params.truck_id });
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

// @desc   Delete Intervention
// @route  Delete /api/v1/intervention/:id
// @access admin

exports.deleteIntervention = asyncHandler(async (req, res, next) => {
  let intervention = await Intervention.deleteOne({ _id: req.params.id });

  if (!intervention) {
    return next(
      new ErrorResponse(
        'Intervention not found with id of ' + req.params.id,
        404
      )
    );
  }
  await Cost.deleteOne({ intervention: req.params.id });
  Intervention.deleteOne(intervention);

  res.status(200).json({
    success: true,
    data: {},
  });
});
