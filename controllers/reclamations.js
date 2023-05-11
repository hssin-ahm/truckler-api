const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Reclamation = require('../models/Reclamation');

// @desc   Get all Reclamations
// @route  GET /api/v1/reclamation
// @access admin
exports.getReclamations = asyncHandler(async (req, res, next) => {
  const reclamation = await Reclamation.find({ disable: false });
  res.status(200).json({
    success: true,
    data: reclamation,
  });
});

// @desc   Create new reclamation
// @route  POST /api/v1/reclamation
// @access admin

exports.createReclamation = asyncHandler(async (req, res, next) => {
  const reclamation = await Reclamation.create(req.body);
  res.status(201).json({
    success: true,
    data: reclamation,
  });
});

// @desc   Get a single Reclamation
// @route  GET /api/v1/reclamation/:id
// @access admin

exports.getReclamation = asyncHandler(async (req, res, next) => {
  const reclamation = await Reclamation.findById(req.params.id);
  if (!reclamation) {
    return next(
      new ErrorResponse(
        'Reclamation not found with id of ' + req.params.id,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: reclamation,
  });
});
// @desc   Update Reclamation
// @route  PUT /api/v1/reclamation/:id
// @access admin

exports.updateReclamation = asyncHandler(async (req, res, next) => {
  let reclamation = await Reclamation.findById(req.params.id);

  if (!reclamation) {
    return next(
      new ErrorResponse(
        'Reclamation not found with id of ' + req.params.id,
        404
      )
    );
  }

  await Reclamation.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    success: true,
  });
});

// @desc   Delete Reclamation
// @route  Delete /api/v1/reclamation/:id
// @access admin

exports.deleteReclamation = asyncHandler(async (req, res, next) => {
  let reclamation = await Reclamation.findById(req.params.id);

  if (!reclamation) {
    return next(
      new ErrorResponse(
        'Reclamation not found with id of ' + req.params.id,
        404
      )
    );
  }

  reclamation.disable = true;
  Reclamation.deleteOne(truck);

  res.status(200).json({
    success: true,
    data: {},
  });
});
